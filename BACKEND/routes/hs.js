const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase.js');


// ============================================================
// GET /api/hs/search?q=horse
//
// Search by:
// 1. HSN code
// 2. Description
// ============================================================

router.get('/search', async (req, res) => {

    const query = req.query.q?.trim();

    if (!query || query.length < 2) {
        return res.json({
            success: true,
            results: [],
            method: 'none'
        });
    }

    try {

        let data = [];
        let method = 'description';

        // ====================================================
        // HSN SEARCH
        // ====================================================

        if (/^\d+$/.test(query)) {

            method = 'hsn';

            const { data: hsnResults, error } = await supabase
                .from('hs_codes')
                .select(`
                    hsn,
                    description,
                    chapter,
                    bcd_pct,
                    sws_pct_of_bcd,
                    igst_pct,
                    cess_pct,
                    igst_verification,
                    bcd_verification,
                    as_of
                `)
                .like('hsn', `${query}%`)
                .limit(20);

            if (error) throw error;

            data = hsnResults || [];

        }

        // ====================================================
        // DESCRIPTION SEARCH
        // ====================================================

        else {

            const { data: descriptionResults, error } = await supabase
                .from('hs_codes')
                .select(`
                    hsn,
                    description,
                    chapter,
                    bcd_pct,
                    sws_pct_of_bcd,
                    igst_pct,
                    cess_pct,
                    igst_verification,
                    bcd_verification,
                    as_of
                `)
                .ilike('description', `%${query}%`)
                .limit(20);

            if (error) throw error;

            data = descriptionResults || [];

        }

        return res.json({
            success: true,
            method: `supabase_${method}`,
            results: data
        });

    } catch (err) {

        console.error('HS search error:', err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }
});


// ============================================================
// POST /api/hs/verify
//
// Verify an HS code against the 14,000-row tariff database.
// ============================================================

router.post('/verify', async (req, res) => {

    const { hsCode } = req.body;

    if (!hsCode) {
        return res.status(400).json({
            success: false,
            error: 'HS code is required'
        });
    }

    try {

        const cleanCode = String(hsCode)
            .trim()
            .replace(/\s/g, '');

        const { data, error } = await supabase
            .from('hs_codes')
            .select(`
                hsn,
                description,
                chapter,
                bcd_pct,
                sws_pct_of_bcd,
                igst_pct,
                cess_pct,
                igst_verification,
                bcd_verification,
                as_of
            `)
            .eq('hsn', cleanCode)
            .maybeSingle();

        if (error) throw error;

        if (!data) {

            return res.json({
                success: true,
                verified: false,
                result: null
            });

        }

        return res.json({
            success: true,
            verified: true,
            result: data
        });

    } catch (err) {

        console.error('HS verification error:', err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }
});


// ============================================================
// POST /api/hs/confirm
// ============================================================

router.post('/confirm', async (req, res) => {

    const {
        extractionId,
        itemId,
        hsCode
    } = req.body;

    if (!itemId || !hsCode) {
        return res.status(400).json({
            success: false,
            error: 'itemId and hsCode are required'
        });
    }

    try {

        const cleanCode = String(hsCode)
            .trim()
            .replace(/\s/g, '');

        // ----------------------------------------------------
        // FIRST verify against tariff database
        // ----------------------------------------------------

        const { data: tariff, error: tariffError } = await supabase
            .from('hs_codes')
            .select('*')
            .eq('hsn', cleanCode)
            .maybeSingle();

        if (tariffError) throw tariffError;

        if (!tariff) {
            return res.status(400).json({
                success: false,
                error: 'HS code does not exist in tariff database'
            });
        }

        let targetTable = 'extraction_items';
        const { data: standardItem, error: checkError } = await supabase
            .from('extraction_items')
            .select('id')
            .eq('id', itemId)
            .maybeSingle();

        if (!standardItem) {
            const { data: scannedItem } = await supabase
                .from('scanned_pdf_extraction_items')
                .select('id')
                .eq('id', itemId)
                .maybeSingle();
            
            if (scannedItem) {
                targetTable = 'scanned_pdf_extraction_items';
            } else {
                targetTable = 'image_extraction_items';
            }
        }

        const { error } = await supabase
            .from(targetTable)
            .update({
                user_confirmed_hs: cleanCode
            })
            .eq('id', itemId);

        if (error) throw error;

        return res.json({
            success: true,
            confirmedCode: cleanCode,
            tariff
        });

    } catch (err) {

        console.error('HS confirmation error:', err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }
});


module.exports = router;