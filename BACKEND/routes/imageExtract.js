const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");

const supabase = require("../lib/supabase.js");

const imageUpload = require("../middleware/imageUpload.js");

const { authMiddleware } = require("../middleware/auth.js");

const {
    extractAllDataFromImage
} = require("../lib/gemini.js");


// ============================================================
// HELPERS
// ============================================================

function getFieldValue(field) {

    if (
        field &&
        typeof field === "object" &&
        Object.prototype.hasOwnProperty.call(field, "value")
    ) {
        return field.value;
    }

    return field;
}


// ============================================================
// GET CONFIDENCE
// ============================================================

function getConfidence(field) {

    if (
        field &&
        typeof field === "object" &&
        Object.prototype.hasOwnProperty.call(field, "confidence")
    ) {

        const confidence = Number(field.confidence);

        if (Number.isFinite(confidence)) {

            return Math.min(
                Math.max(confidence, 0),
                1
            );

        }

    }

    return null;
}


// ============================================================
// CHECK WHETHER FIELD WAS EXTRACTED
// ============================================================

function isExtracted(field) {

    const value =
        getFieldValue(field);

    if (
        value === null ||
        value === undefined
    ) {

        return false;

    }

    if (
        typeof value === "string" &&
        value.trim() === ""
    ) {

        return false;

    }

    return true;
}


// ============================================================
// RECURSIVELY COLLECT EXTRACTED FIELDS
// ============================================================

function collectExtractedFields(
    object,
    path = "",
    result = []
) {

    if (
        !object ||
        typeof object !== "object"
    ) {

        return result;

    }


    // --------------------------------------------------------
    // Gemini field format:
    //
    // {
    //     value: "...",
    //     confidence: 0.95
    // }
    // --------------------------------------------------------

    if (
        Object.prototype.hasOwnProperty.call(
            object,
            "value"
        )
    ) {

        if (isExtracted(object)) {

            result.push({

                path,

                value:
                    getFieldValue(object),

                confidence:
                    getConfidence(object)

            });

        }

        return result;

    }


    // --------------------------------------------------------
    // ARRAY
    // --------------------------------------------------------

    if (Array.isArray(object)) {

        object.forEach(
            (item, index) => {

                collectExtractedFields(
                    item,
                    `${path}[${index}]`,
                    result
                );

            }
        );

        return result;

    }


    // --------------------------------------------------------
    // OBJECT
    // --------------------------------------------------------

    Object.entries(object).forEach(
        ([key, value]) => {

            const nextPath =
                path
                    ? `${path}.${key}`
                    : key;

            collectExtractedFields(
                value,
                nextPath,
                result
            );

        }
    );


    return result;

}


// ============================================================
// CALCULATE IMAGE EXTRACTION ACCURACY
//
// Only extracted fields are counted.
//
// Example:
//
// 58 extracted fields
// Average confidence = 0.9838
//
// Accuracy = 98.38%
// ============================================================

function calculateImageAccuracy(
    extractedData
) {

    const fields =
        collectExtractedFields(
            extractedData
        );


    if (
        fields.length === 0
    ) {

        return {

            accuracy: 0,

            extractedFields: 0

        };

    }


    let confidenceTotal = 0;

    let confidenceCount = 0;


    fields.forEach(
        field => {

            if (
                field.confidence !== null &&
                Number.isFinite(
                    field.confidence
                )
            ) {

                confidenceTotal +=
                    field.confidence;

                confidenceCount++;

            }

        }
    );


    let accuracy = 0;


    if (
        confidenceCount > 0
    ) {

        accuracy =
            (
                confidenceTotal /
                confidenceCount
            ) * 100;

    }


    return {

        accuracy:
            Number(
                accuracy.toFixed(2)
            ),

        extractedFields:
            fields.length

    };

}


// ============================================================
// FIND LINE ITEMS
// ============================================================

function getItems(
    extractedData
) {

    if (
        extractedData &&
        Array.isArray(
            extractedData.items
        )
    ) {

        return extractedData.items;

    }

    return [];

}


// ============================================================
// POST /api/image-extract
//
// IMAGE
//   ↓
// GEMINI
//   ↓
// ACCURACY
//   ↓
// image_extractions
//   ↓
// image_extraction_items
//   ↓
// RETURN UUID
// ============================================================

router.post(
    "/",
    authMiddleware,
    imageUpload.single("image"),

    async (req, res) => {

        const startTime =
            Date.now();

        let extractionId = null;


        try {

            // ==================================================
            // CHECK PLAN LIMITS
            // ==================================================
            const { data: userProfile, error: userError } = await supabase
                .from("users")
                .select("plan, extractions_used")
                .eq("id", req.userId)
                .single();

            if (userError) {
                console.warn("Failed to retrieve user profile for image limit check:", userError.message);
            } else if (userProfile) {
                const plan = (userProfile.plan || "demo").toLowerCase();
                const extractionsUsed = userProfile.extractions_used || 0;

                let limit = 40;
                if (plan === "pro") {
                    limit = 120;
                } else if (plan === "enterprise") {
                    limit = Infinity;
                }

                if (extractionsUsed >= limit) {
                    return res.status(403).json({
                        success: false,
                        error: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan limit reached. You have used ${extractionsUsed}/${limit} extractions. Please upgrade to a higher plan to continue extracting documents.`
                    });
                }
            }

            // ==================================================
            // VALIDATE IMAGE
            // ==================================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No image uploaded."

                });

            }


            // ==================================================
            // ALLOWED IMAGE TYPES
            // ==================================================

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png"
            ];


            if (
                !allowedTypes.includes(
                    req.file.mimetype
                )
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Only JPG, JPEG and PNG images are supported."

                });

            }


            // ==================================================
            // LOG FILE
            // ==================================================

            console.log(
                "=============================================="
            );

            console.log(
                "QUICKCL IMAGE EXTRACTION"
            );

            console.log(
                `File: ${req.file.originalname}`
            );

            console.log(
                `Type: ${req.file.mimetype}`
            );

            console.log(
                `Size: ${req.file.size} bytes`
            );

            console.log(
                "=============================================="
            );


            // ==================================================
            // USER
            // ==================================================

            const userId =
                req.userId;


            if (!userId) {

                return res.status(401).json({

                    success: false,

                    error:
                        "User authentication required."

                });

            }


            // ==================================================
            // GENERATE UUID
            // ==================================================

            extractionId =
                uuidv4();


            // ==================================================
            // SEND IMAGE TO GEMINI
            // ==================================================

            console.log(
                "Sending image to Gemini..."
            );


            const extractedData =
                await extractAllDataFromImage(
                    req.file.buffer,
                    req.file.mimetype
                );


            // ==================================================
            // VALIDATE GEMINI RESPONSE
            // ==================================================

            if (
                !extractedData ||
                typeof extractedData !== "object"
            ) {

                throw new Error(
                    "Gemini returned an invalid extraction result."
                );

            }


            // ==================================================
            // EXTRACTION TIME
            // ==================================================

            const extractionTime =
                Date.now() -
                startTime;


            // ==================================================
            // CALCULATE ACCURACY
            // ==================================================

            const accuracyResult =
                calculateImageAccuracy(
                    extractedData
                );


            console.log(
                "=============================================="
            );

            console.log(
                "IMAGE EXTRACTION COMPLETE"
            );

            console.log(
                `Extracted fields: ${accuracyResult.extractedFields}`
            );

            console.log(
                `Accuracy: ${accuracyResult.accuracy}%`
            );

            console.log(
                `Extraction time: ${extractionTime} ms`
            );

            console.log(
                "=============================================="
            );


            // ==================================================
            // GENERATE JOB NUMBER
            // ==================================================

            const jobNumber =
                `IMG-${Date.now()}`;


            // ==================================================
            // OPTIONAL CLIENT
            // ==================================================

            const clientId =
                req.body?.clientId ||
                null;


            // ==================================================
            // FILE REFERENCE
            // ==================================================

            const fileReference =
                req.file.originalname;


            // ==================================================
            // INSERT MAIN IMAGE EXTRACTION
            //
            // IMPORTANT:
            //
            // This ONLY uses columns belonging to:
            //
            // image_extractions
            //
            // No PDF-specific columns are used.
            // ==================================================

            const {
                data: extractionRecord,
                error: extractionInsertError
            } = await supabase
                .from("image_extractions")
                .insert({

                    id:
                        extractionId,

                    user_id:
                        userId,

                    client_id:
                        clientId,

                    job_number:
                        jobNumber,

                    file_name:
                        req.file.originalname,

                    file_type:
                        req.file.mimetype,

                    file_reference:
                        fileReference,

                    status:
                        "completed",

                    accuracy_score:
                        accuracyResult.accuracy,

                    extraction_time_ms:
                        extractionTime,

                    extracted_fields_count:
                        accuracyResult.extractedFields,

                    extracted_json:
                        extractedData

                })
                .select()
                .single();


            // ==================================================
            // CHECK MAIN INSERT
            // ==================================================

            if (
                extractionInsertError
            ) {

                console.error(
                    "Supabase image extraction insert error:",
                    extractionInsertError
                );

                throw extractionInsertError;

            }


            // ==================================================
            // FIND LINE ITEMS
            // ==================================================

            const items =
                getItems(
                    extractedData
                );


            // ==================================================
            // SAVE LINE ITEMS
            // ==================================================

            if (
                items.length > 0
            ) {

                const itemRows =
                    items

                        .filter(
                            item =>
                                item &&
                                typeof item === "object"
                        )

                        .map(
                            (item, index) => {

                                return {

                                    image_extraction_id:
                                        extractionRecord.id,

                                    sr_no:
                                        Number(
                                            getFieldValue(
                                                item.sr_no
                                            ) ||
                                            index + 1
                                        ),

                                    item_description:
                                        getFieldValue(
                                            item.item_description ||
                                            item.description
                                        ),

                                    hs_code:
                                        getFieldValue(
                                            item.hs_code
                                        ),

                                    ritc_code:
                                        getFieldValue(
                                            item.ritc_code
                                        ),

                                    quantity:
                                        getFieldValue(
                                            item.quantity
                                        ),

                                    unit:
                                        getFieldValue(
                                            item.unit
                                        ),

                                    unit_price:
                                        getFieldValue(
                                            item.unit_price ||
                                            item.unit_price_fc
                                        ),

                                    total_value:
                                        getFieldValue(
                                            item.total_value ||
                                            item.total_value_fc
                                        ),

                                    fob_value:
                                        getFieldValue(
                                            item.fob_value
                                        ),

                                    assessable_value_inr:
                                        getFieldValue(
                                            item.assessable_value_inr
                                        ),

                                    country_of_origin:
                                        getFieldValue(
                                            item.country_of_origin
                                        ),

                                    bcd_rate:
                                        getFieldValue(
                                            item.bcd_rate
                                        ),

                                    sws_rate:
                                        getFieldValue(
                                            item.sws_rate
                                        ),

                                    igst_rate:
                                        getFieldValue(
                                            item.igst_rate
                                        ),

                                    comp_cess_rate:
                                        getFieldValue(
                                            item.comp_cess_rate
                                        ),

                                    exemption_notification:
                                        getFieldValue(
                                            item.exemption_notification
                                        ),

                                    end_use_code:
                                        getFieldValue(
                                            item.end_use_code
                                        ),

                                    confidence_score:
                                        getConfidence(
                                            item
                                        ),

                                    ai_suggested_hs:
                                        item.ai_suggested_hs ||
                                        [],

                                    user_confirmed_hs:
                                        getFieldValue(
                                            item.user_confirmed_hs
                                        )

                                };

                            }
                        );


                // ==================================================
                // INSERT ITEMS
                // ==================================================

                if (
                    itemRows.length > 0
                ) {

                    const {
                        error: itemsError
                    } = await supabase
                        .from(
                            "image_extraction_items"
                        )
                        .insert(
                            itemRows
                        );


                    if (
                        itemsError
                    ) {

                        console.error(
                            "Image line item save error:",
                            itemsError
                        );

                        // Do not destroy the main
                        // extraction if item storage
                        // fails.

                    }

                }

            }

            // ==================================================
            // INCREMENT EXTRACTION COUNT
            // ==================================================
            try {
                const { data: user } = await supabase
                    .from("users")
                    .select("extractions_used")
                    .eq("id", userId)
                    .single();

                if (user) {
                    await supabase
                        .from("users")
                        .update({
                            extractions_used: (user.extractions_used || 0) + 1
                        })
                        .eq("id", userId);
                }
            } catch (err) {
                console.warn("Failed to update extraction count for image extraction:", err.message);
            }

            // ==================================================
            // FINAL RESPONSE
            // ==================================================
            console.log(
                "Image extraction saved successfully."
            );

            console.log(
                `Extraction ID: ${extractionRecord.id}`
            );


            return res.status(200).json({

                success:
                    true,

                id:
                    extractionRecord.id,

                extractionId:
                    extractionRecord.id,

                jobNumber:
                    jobNumber,

                filename:
                    req.file.originalname,

                mimeType:
                    req.file.mimetype,

                extractionTimeMs:
                    extractionTime,

                extractedFields:
                    accuracyResult.extractedFields,

                accuracy:
                    accuracyResult.accuracy,

                data:
                    extractedData

            });


        } catch (error) {

            // ==================================================
            // ERROR LOG
            // ==================================================

            console.error(
                "=============================================="
            );

            console.error(
                "IMAGE EXTRACTION ERROR"
            );

            console.error(
                error
            );

            console.error(
                "=============================================="
            );


            // ==================================================
            // MARK EXTRACTION AS ERROR
            // ==================================================

            if (
                extractionId
            ) {

                try {

                    await supabase
                        .from(
                            "image_extractions"
                        )
                        .update({

                            status:
                                "error"

                        })
                        .eq(
                            "id",
                            extractionId
                        );

                } catch (
                updateError
                ) {

                    console.error(
                        "Could not update failed image extraction:",
                        updateError
                    );

                }

            }


            // ==================================================
            // SEND ERROR
            // ==================================================

            return res.status(500).json({

                success:
                    false,

                error:
                    "Image extraction failed.",

                message:
                    error.message

            });

        }

    }

);


// ============================================================
// GET /api/image-extract/:id
//
// Used by ImageResults.jsx
//
// Fetch:
// image_extractions
// +
// image_extraction_items
// ============================================================

router.get(
    "/:id",
    authMiddleware,

    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            // ==================================================
            // GET MAIN EXTRACTION
            // ==================================================

            const {
                data: extraction,
                error: extractionError
            } = await supabase
                .from(
                    "image_extractions"
                )
                .select("*")
                .eq(
                    "id",
                    id
                )
                .eq(
                    "user_id",
                    req.userId
                )
                .single();


            if (
                extractionError
            ) {

                console.error(
                    "Image extraction fetch error:",
                    extractionError
                );

                return res.status(404).json({

                    success:
                        false,

                    error:
                        "Image extraction not found."

                });

            }


            // ==================================================
            // GET LINE ITEMS
            // ==================================================

            const {
                data: items,
                error: itemsError
            } = await supabase
                .from(
                    "image_extraction_items"
                )
                .select("*")
                .eq(
                    "image_extraction_id",
                    id
                )
                .order(
                    "sr_no",
                    {
                        ascending:
                            true
                    }
                );


            if (
                itemsError
            ) {

                console.error(
                    "Image extraction items fetch error:",
                    itemsError
                );

            }


            // ==================================================
            // FINAL RESULT
            // ==================================================

            return res.status(200).json({

                success:
                    true,

                data: {

                    ...extraction,

                    items:
                        items || []

                }

            });

        } catch (
        error
        ) {



            console.error(
                "IMAGE RESULT FETCH ERROR"
            );

            console.error(
                error
            );




            return res.status(500).json({

                success:
                    false,

                error:
                    "Failed to fetch image extraction.",

                message:
                    error.message

            });

        }

    }

);


module.exports = router;


