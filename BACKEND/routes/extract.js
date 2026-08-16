const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth.js');

const supabase = require('../lib/supabase.js');

const { extractDocument } = require('../lib/documentExtractor.js');
const { extractWithAI } = require('../lib/gemini.js');

const EXTRACTION_PROMPT = require('../lib/extractionPrompt.js');

// ============================================================
// Helpers
// ============================================================

function fieldValue(field) {
    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'value')
    ) {
        return field.value;
    }

    return field ?? null;
}

function fieldConfidence(field) {
    if (
        field &&
        typeof field === 'object' &&
        Object.prototype.hasOwnProperty.call(field, 'confidence')
    ) {
        const confidence = Number(field.confidence);

        if (!Number.isNaN(confidence)) {
            return Math.max(0, Math.min(1, confidence));
        }
    }

    return 0;
}

// ============================================================
// Determine whether a field was actually extracted
// ============================================================

function isExtractedValue(value) {

    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'string') {
        return value.trim().length > 0;
    }

    if (typeof value === 'number') {
        return true;
    }

    if (typeof value === 'boolean') {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === 'object') {

        // Standard Gemini field:
        // { value: "...", confidence: 0.95 }

        if (Object.prototype.hasOwnProperty.call(value, 'value')) {
            return isExtractedValue(value.value);
        }

        return Object.keys(value).length > 0;
    }

    return false;
}

// ============================================================
// Recursively calculate extraction accuracy
//
// IMPORTANT:
//
// Accuracy is calculated ONLY from fields that have actual
// extracted values.
//
// Missing/null fields are NOT counted as failures.
//
// Example:
//
// 100 applicable fields
// 92 extracted
//
// Accuracy = average confidence of those 92 extracted fields
//
// NOT:
//
// 92 / 147
// ============================================================

function calculateExtractionAccuracy(data) {

    let totalExtractedFields = 0;
    let confidenceSum = 0;

    function walk(node) {

        if (node === null || node === undefined) {
            return;
        }

        // Arrays
        if (Array.isArray(node)) {

            for (const item of node) {
                walk(item);
            }

            return;
        }

        // Objects
        if (typeof node === 'object') {

            // Standard field object:
            //
            // {
            //   value: "...",
            //   confidence: 0.95
            // }

            if (
                Object.prototype.hasOwnProperty.call(node, 'value') &&
                Object.prototype.hasOwnProperty.call(node, 'confidence')
            ) {

                if (isExtractedValue(node.value)) {

                    totalExtractedFields++;

                    const confidence =
                        fieldConfidence(node);

                    confidenceSum += confidence;
                }

                return;
            }

            for (const key of Object.keys(node)) {

                // Do not count overall_confidence as a field.
                if (key === 'overall_confidence') {
                    continue;
                }

                // Metadata should not be treated as extracted fields.
                if (
                    key === 'document_type' ||
                    key === 'extraction_notes'
                ) {
                    continue;
                }

                walk(node[key]);
            }

            return;
        }

        // Primitive values that are not wrapped in
        // {value, confidence}
        //
        // We count them with confidence 1.
        if (isExtractedValue(node)) {

            totalExtractedFields++;

            confidenceSum += 1;
        }
    }

    walk(data);

    const accuracy =
        totalExtractedFields > 0
            ? confidenceSum / totalExtractedFields
            : 0;

    return {
        accuracy,
        accuracyPercent: accuracy * 100,
        extractedFields: totalExtractedFields
    };
}

// ============================================================
// POST /api/extract
// ============================================================

router.post(
    '/',
    authMiddleware,

    upload.fields([
        { name: 'invoice', maxCount: 1 },
        { name: 'packingList', maxCount: 1 },
        { name: 'billOfLading', maxCount: 1 },
        { name: 'coo', maxCount: 1 },
        { name: 'licence', maxCount: 1 }
    ]),

    async (req, res) => {

        const startTime = Date.now();

        try {

            // =================================================
            // STEP 0.0
            // Check plan limits (Free: 50, Pro: 120, Enterprise: Unlimited)
            // =================================================

            const { data: userProfile, error: userError } = await supabase
                .from('users')
                .select('plan, extractions_used')
                .eq('id', req.userId)
                .single();

            if (userError) {
                console.warn('Failed to retrieve user profile for limit check:', userError.message);
            } else if (userProfile) {
                const plan = (userProfile.plan || 'demo').toLowerCase();
                const extractionsUsed = userProfile.extractions_used || 0;

                let limit = 40;
                if (plan === 'pro') {
                    limit = 120;
                } else if (plan === 'enterprise') {
                    limit = Infinity;
                }

                if (extractionsUsed >= limit) {
                    return res.status(403).json({
                        error: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan limit reached. You have used ${extractionsUsed}/${limit} extractions. Please upgrade to a higher plan to continue extracting documents.`
                    });
                }
            }

            // =================================================
            // STEP 0
            // Document type
            // =================================================

            const docType =
                req.body.docType === 'SB'
                    ? 'SB'
                    : 'BOE';


            // =================================================
            // STEP 0.1
            // Invoice is mandatory
            // =================================================

            const invoice =
                req.files?.invoice?.[0];

            if (!invoice) {

                return res.status(400).json({
                    error: 'Commercial invoice is required'
                });

            }


            // =================================================
            // STEP 0.2
            // Collect all files
            // =================================================

            const allFiles =
                Object.values(req.files || {}).flat();


            // =================================================
            // STEP 1
            // Upload files to Supabase Storage
            // =================================================

            let uploads = [];

            try {

                uploads =
                    await Promise.all(

                        allFiles.map(async (file) => {

                            const path =
                                `extractions/${req.userId}/${Date.now()}_${file.originalname}`;

                            const {
                                error
                            } =
                                await supabase
                                    .storage
                                    .from('documents')
                                    .upload(
                                        path,
                                        file.buffer,
                                        {
                                            contentType:
                                                file.mimetype
                                        }
                                    );

                            if (error) {
                                throw error;
                            }

                            return {
                                name: file.fieldname,
                                path
                            };

                        })

                    );

            } catch (err) {

                console.warn(
                    'Storage Upload Failed:',
                    err.message
                );

                // Storage failure must not stop extraction.
                uploads = [];
            }


            // =================================================
            // STEP 2
            // Extract text from all documents
            // =================================================

            const ocrResults =
                await Promise.all(

                    allFiles.map(async (file) => {

                        console.log(
                            '--------------------------------'
                        );

                        console.log(
                            'Reading:',
                            file.originalname
                        );

                        console.time(
                            `extract-${file.originalname}`
                        );

                        const text =
                            await extractDocument(file);

                        console.timeEnd(
                            `extract-${file.originalname}`
                        );

                        console.log(
                            'Characters:',
                            text?.length || 0
                        );

                        console.log(
                            '--------------------------------'
                        );

                        return {
                            name:
                                file.originalname,

                            text:
                                text || ''
                        };

                    })

                );


            // =================================================
            // STEP 3
            // Combine OCR text
            // =================================================

            const combinedText =
                ocrResults
                    .map(
                        r =>
                            `=== ${r.name} ===\n${r.text}`
                    )
                    .join('\n\n');


            // =================================================
            // STEP 4
            // Gemini extraction
            //
            // IMPORTANT:
            //
            // NO HS DATABASE VERIFICATION HERE.
            //
            // Gemini's extracted result remains untouched.
            // =================================================

            const prompt =
                EXTRACTION_PROMPT +

                `

============================================================
DOCUMENT TYPE
============================================================

${docType === 'BOE'
                    ? 'Bill of Entry (Import)'
                    : 'Shipping Bill (Export)'}

============================================================
SOURCE DOCUMENTS
============================================================

${combinedText}

============================================================
FINAL EXTRACTION INSTRUCTION
============================================================

Extract ALL 147 fields defined in the schema.

Search ALL supplied documents completely.

Extract every value that is actually present.

Do NOT invent missing values.

For fields that are genuinely unavailable:

{
    "value": null,
    "confidence": 0
}

For extracted fields:

{
    "value": "actual document value",
    "confidence": 0.00
}

HS CODE RULE:

Only extract an HS/HSN/CTH/RITC code when it is explicitly
visible in the supplied documents.

Do NOT classify a product into an HS code.

Do NOT invent an HS code.

Return ONLY valid JSON.
`;


            console.log(
                'Sending document text to Gemini...'
            );

            const extractedData =
                await extractWithAI(
                    prompt,
                    ''
                );


            // =================================================
            // STEP 4.1
            // Validate Gemini response
            // =================================================

            if (
                !extractedData ||
                typeof extractedData !== 'object'
            ) {

                throw new Error(
                    'AI returned invalid extraction JSON'
                );

            }


            // =================================================
            // STEP 4.2
            // Set document type
            // =================================================

            extractedData.document_type =
                extractedData.document_type ||
                docType;


            // =================================================
            // STEP 5
            // Calculate accuracy
            //
            // ONLY extracted fields are counted.
            // Missing fields are ignored.
            // =================================================

            const accuracyStats =
                calculateExtractionAccuracy(
                    extractedData
                );


            console.log(
                '================================'
            );

            console.log(
                'EXTRACTION STATISTICS'
            );

            console.log(
                'Extracted fields:',
                accuracyStats.extractedFields
            );

            console.log(
                'Accuracy:',
                accuracyStats.accuracyPercent.toFixed(2) + '%'
            );

            console.log(
                '================================'
            );


            // =================================================
            // IMPORTANT:
            //
            // We keep Gemini's original overall_confidence
            // only as metadata.
            //
            // The application accuracy is calculated by
            // calculateExtractionAccuracy().
            // =================================================

            const geminiOverallConfidence =
                Number(
                    extractedData.overall_confidence
                ) || 0;


            // =================================================
            // STEP 6
            // Extraction time
            // =================================================

            const extractionTime =
                Date.now() - startTime;


            // =================================================
            // STEP 7
            // Save extraction
            // =================================================

            const jobNumber =
                fieldValue(
                    extractedData.job?.job_number
                ) ||

                fieldValue(
                    extractedData.job?.jobNo
                ) ||

                `${docType}-${Date.now()}`;


            const {
                data: extraction,
                error: extractionError
            } =
                await supabase
                    .from('extractions')
                    .insert({

                        user_id:
                            req.userId,

                        job_number:
                            jobNumber,

                        doc_type:
                            docType,

                        extracted_json:
                            extractedData,

                        raw_ocr_text:
                            ocrResults,

                        // THIS is now the real application
                        // extraction accuracy.
                        accuracy_score:
                            accuracyStats.accuracyPercent,

                        extraction_time_ms:
                            extractionTime,

                        status:
                            'completed',

                        invoice_doc_url:
                            uploads.find(
                                u =>
                                    u.name === 'invoice'
                            )?.path || null,

                        packing_doc_url:
                            uploads.find(
                                u =>
                                    u.name === 'packingList'
                            )?.path || null,

                        bl_doc_url:
                            uploads.find(
                                u =>
                                    u.name === 'billOfLading'
                            )?.path || null

                    })
                    .select()
                    .single();


            if (extractionError) {
                throw extractionError;
            }


            // =================================================
            // STEP 8
            // Save line items
            // =================================================

            if (
                Array.isArray(
                    extractedData.items
                ) &&
                extractedData.items.length > 0
            ) {

                const lineItems =
                    extractedData.items.map(
                        (item, idx) => {

                            const description =
                                fieldValue(
                                    item.description
                                );

                            const hsCode =
                                fieldValue(
                                    item.hs_code
                                ) ||

                                fieldValue(
                                    item.hsn
                                ) ||

                                fieldValue(
                                    item.ritc_code
                                );


                            const quantity =
                                fieldValue(
                                    item.quantity
                                );

                            const unit =
                                fieldValue(
                                    item.unit
                                );

                            const unitPrice =
                                fieldValue(
                                    item.unit_price_fc
                                ) ??

                                fieldValue(
                                    item.unit_price
                                );

                            const totalValue =
                                fieldValue(
                                    item.total_value_fc
                                ) ??

                                fieldValue(
                                    item.total_value
                                );


                            return {

                                extraction_id:
                                    extraction.id,

                                sr_no:
                                    Number(
                                        fieldValue(
                                            item.sr_no
                                        )
                                    ) ||
                                    idx + 1,

                                item_description:
                                    description || '',

                                // Gemini value only.
                                //
                                // NO Supabase verification.
                                hs_code:
                                    hsCode || null,

                                quantity:
                                    parseFloat(
                                        quantity
                                    ) || null,

                                unit:
                                    unit || null,

                                unit_price:
                                    parseFloat(
                                        unitPrice
                                    ) || null,

                                total_value:
                                    parseFloat(
                                        totalValue
                                    ) || null,

                                confidence_score:
                                    fieldConfidence(
                                        item.description
                                    ) ||

                                    fieldConfidence(
                                        item
                                    ) ||

                                    0,

                                // Keep Gemini suggestions
                                // exactly as returned.
                                ai_suggested_hs:
                                    item.suggestedHSCodes ||
                                    item.ai_suggested_hs ||
                                    []

                            };

                        }
                    );


                const {
                    error: itemsError
                } =
                    await supabase
                        .from('extraction_items')
                        .insert(
                            lineItems
                        );


                if (itemsError) {

                    console.warn(
                        'Line item save failed:',
                        itemsError.message
                    );

                }

            }


            // =================================================
            // STEP 9
            // Increment extraction count
            // =================================================

            try {

                const {
                    data: user
                } =
                    await supabase
                        .from('users')
                        .select(
                            'extractions_used'
                        )
                        .eq(
                            'id',
                            req.userId
                        )
                        .single();


                if (user) {

                    await supabase
                        .from('users')
                        .update({

                            extractions_used:
                                (
                                    user.extractions_used ||
                                    0
                                ) + 1

                        })
                        .eq(
                            'id',
                            req.userId
                        );

                }

            } catch (err) {

                console.warn(
                    'Failed to update extraction count:',
                    err.message
                );

            }


            // =================================================
            // STEP 10
            // Response
            // =================================================

            return res.json({

                id:
                    extraction.id,

                jobNumber:
                    extraction.job_number,

                extractedData:
                    extractedData,

                // Real calculated accuracy
                accuracy:
                    accuracyStats.accuracy,

                accuracyPercent:
                    accuracyStats.accuracyPercent,

                extractedFields:
                    accuracyStats.extractedFields,

                // Gemini's own score kept separately
                geminiOverallConfidence:
                    geminiOverallConfidence,

                extractionTimeMs:
                    extractionTime,

                status:
                    'completed'

            });

        } catch (err) {

            console.error(
                'Extraction error:',
                err
            );

            return res.status(500).json({

                error:
                    'Extraction failed',

                details:
                    err.message

            });

        }

    }
);

module.exports = router;