const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const scannedUpload = require('../middleware/scannedUpload');
const { authMiddleware } = require('../middleware/auth.js');
const supabase = require('../lib/supabase.js');

const { extractAllDataFromScannedPDF } = require('../lib/scannedPdfExtractor.js');
const SCANNED_EXTRACTION_PROMPT = require('../lib/scannedExtractionPrompt.js');

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
        if (Object.prototype.hasOwnProperty.call(value, 'value')) {
            return isExtractedValue(value.value);
        }
        return Object.keys(value).length > 0;
    }

    return false;
}

function calculateScannedAccuracy(data) {
    let totalExtractedFields = 0;
    let confidenceSum = 0;

    function walk(node) {
        if (node === null || node === undefined) {
            return;
        }

        if (Array.isArray(node)) {
            for (const item of node) {
                walk(item);
            }
            return;
        }

        if (typeof node === 'object') {
            if (
                Object.prototype.hasOwnProperty.call(node, 'value') &&
                Object.prototype.hasOwnProperty.call(node, 'confidence')
            ) {
                if (isExtractedValue(node.value)) {
                    totalExtractedFields++;
                    const confidence = fieldConfidence(node);
                    confidenceSum += confidence;
                }
                return;
            }

            for (const key of Object.keys(node)) {
                if (key === 'overall_confidence') {
                    continue;
                }
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
// POST /api/scanned-extract
// ============================================================

router.post(
    '/',
    authMiddleware,
    scannedUpload.fields([
        { name: 'invoice', maxCount: 1 },
        { name: 'packingList', maxCount: 1 },
        { name: 'billOfLading', maxCount: 1 },
        { name: 'coo', maxCount: 1 },
        { name: 'licence', maxCount: 1 }
    ]),
    async (req, res) => {
        const startTime = Date.now();
        let extractionId = null;

        try {
            // Check plan limits
            const { data: userProfile, error: userError } = await supabase
                .from('users')
                .select('plan, extractions_used')
                .eq('id', req.userId)
                .single();

            if (userError) {
                console.warn('Failed to retrieve user profile for scanned limit check:', userError.message);
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
                        success: false,
                        error: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan limit reached. You have used ${extractionsUsed}/${limit} extractions. Please upgrade to a higher plan to continue.`
                    });
                }
            }

            const invoice = req.files?.invoice?.[0];
            const packingList = req.files?.packingList?.[0];
            const billOfLading = req.files?.billOfLading?.[0];
            const coo = req.files?.coo?.[0];
            const licence = req.files?.licence?.[0];

            if (!invoice) {
                return res.status(400).json({
                    success: false,
                    error: 'Commercial Invoice is required'
                });
            }

            const allFiles = [];
            if (invoice) allFiles.push(invoice);
            if (packingList) allFiles.push(packingList);
            if (billOfLading) allFiles.push(billOfLading);
            if (coo) allFiles.push(coo);
            if (licence) allFiles.push(licence);

            const docType = req.body.docType === 'SB' ? 'SB' : 'BOE';
            const clientId = req.body.clientId || null;

            // Upload PDFs to Supabase Storage
            let uploads = [];
            try {
                uploads = await Promise.all(
                    allFiles.map(async (file) => {
                        const path = `scanned_extractions/${req.userId}/${Date.now()}_${file.originalname}`;
                        const { error: uploadError } = await supabase.storage
                            .from('documents')
                            .upload(path, file.buffer, {
                                contentType: file.mimetype
                            });

                        if (uploadError) throw uploadError;
                        return {
                            name: file.fieldname,
                            path,
                            originalname: file.originalname
                        };
                    })
                );
            } catch (err) {
                console.warn('Scanned PDF Storage Upload Failed:', err.message);
                uploads = [];
            }

            // Extract with Gemini native PDF OCR
            console.log('Sending scanned PDFs to Gemini...');
            const extractedData = await extractAllDataFromScannedPDF(
                allFiles,
                SCANNED_EXTRACTION_PROMPT + `
============================================================
DOCUMENT TYPE
============================================================
${docType === 'BOE' ? 'Bill of Entry (Import)' : 'Shipping Bill (Export)'}

Return ONLY valid JSON according to the schema.
`
            );

            if (!extractedData || typeof extractedData !== 'object') {
                throw new Error('AI returned invalid extraction JSON');
            }

            extractedData.document_type = extractedData.document_type || docType;

            const accuracyStats = calculateScannedAccuracy(extractedData);
            const extractionTime = Date.now() - startTime;

            const jobNumber =
                fieldValue(extractedData.job?.job_number) ||
                fieldValue(extractedData.job?.jobNo) ||
                `SCN-${Date.now()}`;

            const invoiceUrl = uploads.find(u => u.name === 'invoice')?.path || null;
            const packingUrl = uploads.find(u => u.name === 'packingList')?.path || null;
            const blUrl = uploads.find(u => u.name === 'billOfLading')?.path || null;
            const cooUrl = uploads.find(u => u.name === 'coo')?.path || null;
            const licenceUrl = uploads.find(u => u.name === 'licence')?.path || null;

            // Save to scanned_pdf_extractions
            extractionId = uuidv4();
            const { data: extraction, error: extractionError } = await supabase
                .from('scanned_pdf_extractions')
                .insert({
                    id: extractionId,
                    user_id: req.userId,
                    client_id: clientId,
                    job_number: jobNumber,
                    doc_type: docType,
                    extracted_json: extractedData,
                    accuracy_score: accuracyStats.accuracyPercent,
                    extraction_time_ms: extractionTime,
                    status: 'completed',
                    invoice_doc_url: invoiceUrl,
                    packing_doc_url: packingUrl,
                    bl_doc_url: blUrl,
                    coo_doc_url: cooUrl,
                    licence_doc_url: licenceUrl,
                    file_reference: invoice.originalname
                })
                .select()
                .single();

            if (extractionError) throw extractionError;

            // Save scanned line items
            if (Array.isArray(extractedData.items) && extractedData.items.length > 0) {
                const lineItems = extractedData.items.map((item, idx) => {
                    const description = fieldValue(item.description || item.item_description);
                    const hsCode = fieldValue(item.hs_code) || fieldValue(item.hsn) || fieldValue(item.ritc_code);
                    const quantity = fieldValue(item.quantity);
                    const unit = fieldValue(item.unit);
                    const unitPrice = fieldValue(item.unit_price) || fieldValue(item.unit_price_fc);
                    const totalValue = fieldValue(item.total_value) || fieldValue(item.total_value_fc);

                    return {
                        scanned_pdf_extraction_id: extraction.id,
                        sr_no: Number(fieldValue(item.sr_no)) || idx + 1,
                        item_description: description || '',
                        hs_code: hsCode || null,
                        quantity: parseFloat(quantity) || null,
                        unit: unit || null,
                        unit_price: parseFloat(unitPrice) || null,
                        total_value: parseFloat(totalValue) || null,
                        confidence_score: fieldConfidence(item.description) || fieldConfidence(item) || 0,
                        ai_suggested_hs: item.ai_suggested_hs || item.suggestedHSCodes || []
                    };
                });

                const { error: itemsError } = await supabase
                    .from('scanned_pdf_extraction_items')
                    .insert(lineItems);

                if (itemsError) {
                    console.warn('Scanned PDF line items save failed:', itemsError.message);
                }
            }

            // Increment extraction usage count
            try {
                const { data: user } = await supabase
                    .from('users')
                    .select('extractions_used')
                    .eq('id', req.userId)
                    .single();

                if (user) {
                    await supabase
                        .from('users')
                        .update({
                            extractions_used: (user.extractions_used || 0) + 1
                        })
                        .eq('id', req.userId);
                }
            } catch (err) {
                console.warn('Failed to update extraction count:', err.message);
            }

            return res.status(200).json({
                success: true,
                id: extraction.id,
                jobNumber: extraction.job_number,
                extractedData: extractedData,
                accuracy: accuracyStats.accuracy,
                accuracyPercent: accuracyStats.accuracyPercent,
                extractedFields: accuracyStats.extractedFields,
                extractionTimeMs: extractionTime,
                status: 'completed'
            });

        } catch (error) {
            console.error('Scanned PDF extraction error:', error);

            if (extractionId) {
                try {
                    await supabase
                        .from('scanned_pdf_extractions')
                        .update({ status: 'error' })
                        .eq('id', extractionId);
                } catch (updateError) {
                    console.error('Could not update failed scanned extraction status:', updateError);
                }
            }

            return res.status(500).json({
                success: false,
                error: 'Scanned PDF extraction failed',
                details: error.message
            });
        }
    }
);

// ============================================================
// GET /api/scanned-extract/:id
// ============================================================

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: extraction, error: extractionError } = await supabase
            .from('scanned_pdf_extractions')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.userId)
            .single();

        if (extractionError || !extraction) {
            return res.status(404).json({
                success: false,
                error: 'Scanned PDF extraction not found'
            });
        }

        const { data: items, error: itemsError } = await supabase
            .from('scanned_pdf_extraction_items')
            .select('*')
            .eq('scanned_pdf_extraction_id', id)
            .order('sr_no', { ascending: true });

        if (itemsError) {
            console.warn('Scanned PDF items fetch error:', itemsError.message);
        }

        return res.status(200).json({
            success: true,
            data: {
                ...extraction,
                items: items || []
            }
        });

    } catch (error) {
        console.error('Scanned PDF fetch error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch scanned PDF extraction'
        });
    }
});

module.exports = router;
