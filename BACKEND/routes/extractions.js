// const express = require('express');
// const router = express.Router();
// const supabase = require('../lib/supabase');
// const { authMiddleware } = require('../middleware/auth');

// // GET /api/extractions - List all extractions for this user
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, type } = req.query;
//     const offset = (page - 1) * limit;

//     let query = supabase
//       .from('extractions')
//       .select('*', { count: 'exact' })
//       .eq('user_id', req.userId)
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1);

//     if (type) query = query.eq('doc_type', type);

//     const { data, count, error } = await query;
//     if (error) throw error;

//     res.json({ extractions: data, total: count, page: Number(page) });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/extractions/:id - Get single extraction with items
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { data: extraction, error } = await supabase
//       .from('extractions')
//       .select('*')
//       .eq('id', req.params.id)
//       .eq('user_id', req.userId)
//       .single();

//     if (error || !extraction) {
//       return res.status(404).json({ error: 'Extraction not found' });
//     }

//     const { data: items } = await supabase
//       .from('extraction_items')
//       .select('*')
//       .eq('extraction_id', req.params.id)
//       .order('sr_no');

//     res.json({ ...extraction, items: items || [] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PATCH /api/extractions/:id - Edit a field (with audit trail)
// router.patch('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { field, newValue } = req.body;
//     // field = "importer_exporter.adCode"

//     // 1. Get current data
//     const { data: extraction } = await supabase
//       .from('extractions')
//       .select('extracted_json')
//       .eq('id', req.params.id)
//       .single();

//     // 2. Navigate to the field and get old value
//     const json = extraction.extracted_json;
//     const path = field.split('.');
//     let current = json;
//     for (let i = 0; i < path.length - 1; i++) current = current[path[i]];
//     const lastKey = path[path.length - 1];
//     const oldValue = current[lastKey]?.value || current[lastKey];

//     // 3. Update the value
//     current[lastKey] = { value: newValue, confidence: 1.0, editedBy: 'user' };

//     // 4. Save
//     await supabase.from('extractions')
//       .update({ extracted_json: json })
//       .eq('id', req.params.id);

//     // 5. Audit log
//     await supabase.from('extraction_history').insert({
//       extraction_id: req.params.id,
//       user_id: req.userId,
//       action: 'field_edit',
//       field_changed: field,
//       old_value: String(oldValue),
//       new_value: newValue,
//     });

//     res.json({ success: true, field, oldValue, newValue });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/extractions/:id/excel - Download as Excel
// router.get('/:id/excel', authMiddleware, async (req, res) => {
//   const XLSX = require('xlsx');
//   try {
//     const { data: ext } = await supabase.from('extractions')
//       .select('*').eq('id', req.params.id).single();
//     const { data: items } = await supabase.from('extraction_items')
//       .select('*').eq('extraction_id', req.params.id);

//     const wb = XLSX.utils.book_new();
//     const json = ext.extracted_json;

//     // Sheet per section
//     const sections = ['job','importer_exporter','foreign_party','consignee',
//       'shipment','invoice','packing'];
//     for (const sec of sections) {
//       if (json[sec]) {
//         const rows = Object.entries(json[sec]).map(([k, v]) => ({
//           Field: k, Value: v?.value || v, Confidence: v?.confidence || ''
//         }));
//         XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sec);
//       }
//     }

//     // Items sheet
//     if (items?.length) {
//       const itemRows = items.map(i => ({
//         Sr: i.sr_no, Description: i.item_description,
//         HS_Code: i.hs_code, Qty: i.quantity, Unit: i.unit,
//         Price: i.unit_price, Total: i.total_value
//       }));
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemRows), 'items');
//     }

//     const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename="${ext.job_number}.xlsx"`);
//     res.send(buffer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;















const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// ============================================================
// GET /api/extractions
// List PDF + IMAGE extractions for this user
// ============================================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      search = '',
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let normalizedType = type;
    if (!type || type === 'undefined' || type === 'null' || type.trim() === '' || type.toLowerCase() === 'all') {
      normalizedType = null;
    }

    let normalizedSearch = search;
    if (!search || search === 'undefined' || search === 'null') {
      normalizedSearch = '';
    }

    // --------------------------------------------------------
    // Get counts for each type dynamically
    // --------------------------------------------------------
    const { count: boeCount } = await supabase
      .from('extractions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('doc_type', 'BOE');

    const { count: sbCount } = await supabase
      .from('extractions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('doc_type', 'SB');

    const { count: imageCount } = await supabase
      .from('image_extractions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    const { count: scannedCount } = await supabase
      .from('scanned_pdf_extractions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    const counts = {
      boe: boeCount || 0,
      sb: sbCount || 0,
      image: imageCount || 0,
      scanned: scannedCount || 0,
      all: (boeCount || 0) + (sbCount || 0) + (imageCount || 0) + (scannedCount || 0)
    };

    let pdfRecords = [];
    let imageRecords = [];
    let scannedRecords = [];

    // 1. Get PDF extractions if type is not IMAGE/SCANNED
    if (!normalizedType || normalizedType === 'BOE' || normalizedType === 'SB') {
      let pdfQuery = supabase
        .from('extractions')
        .select(
          `
          id,
          user_id,
          client_id,
          job_number,
          job_date,
          doc_type,
          port_code,
          port_name,
          file_reference,
          status,
          accuracy_score,
          extraction_time_ms,
          created_at
          `
        )
        .eq('user_id', req.userId);

      if (normalizedType) {
        pdfQuery = pdfQuery.eq('doc_type', normalizedType);
      }

      if (normalizedSearch) {
        pdfQuery = pdfQuery.ilike('job_number', `%${normalizedSearch}%`);
      }

      const { data: pdfData, error: pdfError } = await pdfQuery;
      if (pdfError) throw pdfError;

      pdfRecords = (pdfData || []).map((ext) => ({
        ...ext,
        result_type: 'pdf',
        file_type: 'pdf',
        display_type: ext.doc_type,
      }));
    }

    // 2. Get IMAGE extractions if type is IMAGE
    if (!normalizedType || normalizedType === 'IMAGE' || normalizedType === 'image') {
      let imageQuery = supabase
        .from('image_extractions')
        .select(
          `
          id,
          user_id,
          client_id,
          job_number,
          file_name,
          file_type,
          file_reference,
          status,
          accuracy_score,
          extraction_time_ms,
          extracted_fields_count,
          created_at
          `
        )
        .eq('user_id', req.userId);

      if (normalizedSearch) {
        imageQuery = imageQuery.ilike('job_number', `%${normalizedSearch}%`);
      }

      const { data: imageData, error: imageError } = await imageQuery;
      if (imageError) throw imageError;

      imageRecords = (imageData || []).map((ext) => ({
        ...ext,
        result_type: 'image',
        doc_type: 'IMAGE',
        display_type: 'IMAGE',
      }));
    }

    // 3. Get SCANNED extractions if type is SCANNED
    if (!normalizedType || normalizedType === 'SCANNED' || normalizedType === 'scanned') {
      let scannedQuery = supabase
        .from('scanned_pdf_extractions')
        .select(
          `
          id,
          user_id,
          client_id,
          job_number,
          file_reference,
          status,
          accuracy_score,
          extraction_time_ms,
          created_at,
          doc_type
          `
        )
        .eq('user_id', req.userId);

      if (normalizedSearch) {
        scannedQuery = scannedQuery.ilike('job_number', `%${normalizedSearch}%`);
      }

      const { data: scannedData, error: scannedError } = await scannedQuery;
      if (scannedError) throw scannedError;

      scannedRecords = (scannedData || []).map((ext) => ({
        ...ext,
        result_type: 'scanned',
        file_type: 'pdf',
        display_type: 'SCANNED',
      }));
    }

    // Combine PDF + IMAGE + SCANNED records
    let combined = [
      ...pdfRecords,
      ...imageRecords,
      ...scannedRecords,
    ];

    // Sort newest first
    combined.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Total records for this filtered view
    const total = combined.length;

    // Apply pagination AFTER combining
    const paginated = combined.slice(offset, offset + limitNumber);

    // Compute stats dynamically across all user records
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonthCount = combined.filter(e => new Date(e.created_at) >= startOfMonth).length;

    const accuracyRecords = combined.filter(e => e.accuracy_score != null);
    const avgAccuracy = accuracyRecords.length
      ? accuracyRecords.reduce((sum, r) => sum + r.accuracy_score, 0) / accuracyRecords.length
      : 0;

    const stats = {
      total: combined.length,
      thisMonth: thisMonthCount,
      avgAccuracy: Number(avgAccuracy.toFixed(1))
    };

    res.json({
      extractions: paginated,
      total,
      page: pageNumber,
      counts,
      stats
    });

  } catch (err) {
    console.error('History error:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ============================================================
// GET /api/extractions/:id
// Get single PDF extraction
// ============================================================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    let extraction;
    let items = [];
    let itemsTable = 'extraction_items';
    let foreignKey = 'extraction_id';
    let isScanned = false;
    let resultType = 'pdf';

    const { data: standardExt } = await supabase
      .from('extractions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (standardExt) {
      extraction = standardExt;
      itemsTable = 'extraction_items';
      foreignKey = 'extraction_id';
      resultType = 'pdf';
    } else {
      const { data: scanExt } = await supabase
        .from('scanned_pdf_extractions')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.userId)
        .maybeSingle();

      if (scanExt) {
        extraction = scanExt;
        itemsTable = 'scanned_pdf_extraction_items';
        foreignKey = 'scanned_pdf_extraction_id';
        isScanned = true;
        resultType = 'scanned';
      } else {
        const { data: imgExt } = await supabase
          .from('image_extractions')
          .select('*')
          .eq('id', req.params.id)
          .eq('user_id', req.userId)
          .maybeSingle();

        if (!imgExt) {
          return res.status(404).json({
            error: 'Extraction not found',
          });
        }
        extraction = imgExt;
        itemsTable = 'image_extraction_items';
        foreignKey = 'image_extraction_id';
        resultType = 'image';
      }
    }

    const { data: fetchedItems } = await supabase
      .from(itemsTable)
      .select('*')
      .eq(foreignKey, req.params.id)
      .order('sr_no');

    res.json({
      ...extraction,
      items: fetchedItems || [],
      result_type: resultType
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// ============================================================
// PATCH /api/extractions/:id
// Edit a PDF extraction field
// ============================================================
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { field, newValue } = req.body;

    // 1. Get current data
    let extraction;
    let targetTable = 'extractions';

    const { data: standardExt } = await supabase
      .from('extractions')
      .select('extracted_json')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (standardExt) {
      extraction = standardExt;
      targetTable = 'extractions';
    } else {
      const { data: scanExt } = await supabase
        .from('scanned_pdf_extractions')
        .select('extracted_json')
        .eq('id', req.params.id)
        .eq('user_id', req.userId)
        .maybeSingle();

      if (scanExt) {
        extraction = scanExt;
        targetTable = 'scanned_pdf_extractions';
      } else {
        const { data: imgExt } = await supabase
          .from('image_extractions')
          .select('extracted_json')
          .eq('id', req.params.id)
          .eq('user_id', req.userId)
          .maybeSingle();

        if (!imgExt) {
          return res.status(404).json({
            error: 'Extraction not found',
          });
        }
        extraction = imgExt;
        targetTable = 'image_extractions';
      }
    }

    // 2. Navigate to the field
    const json = extraction.extracted_json;
    const path = field.split('.');

    let current = json;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    const lastKey = path[path.length - 1];

    const oldValue =
      current[lastKey]?.value ||
      current[lastKey];

    // 3. Update the value
    current[lastKey] = {
      value: newValue,
      confidence: 1.0,
      editedBy: 'user',
    };

    // 4. Save
    const { error: updateError } = await supabase
      .from(targetTable)
      .update({
        extracted_json: json,
      })
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (updateError) throw updateError;

    // 5. Audit log
    await supabase
      .from('extraction_history')
      .insert({
        extraction_id: req.params.id,
        user_id: req.userId,
        action: 'field_edit',
        field_changed: field,
        old_value: String(oldValue),
        new_value: newValue,
      });

    res.json({
      success: true,
      field,
      oldValue,
      newValue,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// ============================================================
// GET /api/extractions/:id/excel
// Download PDF extraction as Excel
// ============================================================
router.get('/:id/excel', authMiddleware, async (req, res) => {
  const XLSX = require('xlsx');

  try {
    let ext;
    let items = [];
    let itemsTable = 'extraction_items';
    let foreignKey = 'extraction_id';

    const { data: standardExt } = await supabase
      .from('extractions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .maybeSingle();

    if (standardExt) {
      ext = standardExt;
      itemsTable = 'extraction_items';
      foreignKey = 'extraction_id';
    } else {
      const { data: scanExt } = await supabase
        .from('scanned_pdf_extractions')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.userId)
        .maybeSingle();

      if (scanExt) {
        ext = scanExt;
        itemsTable = 'scanned_pdf_extraction_items';
        foreignKey = 'scanned_pdf_extraction_id';
      } else {
        const { data: imgExt } = await supabase
          .from('image_extractions')
          .select('*')
          .eq('id', req.params.id)
          .eq('user_id', req.userId)
          .maybeSingle();

        if (!imgExt) {
          return res.status(404).json({
            error: 'Extraction not found',
          });
        }
        ext = imgExt;
        itemsTable = 'image_extraction_items';
        foreignKey = 'image_extraction_id';
      }
    }

    const { data: fetchedItems } = await supabase
      .from(itemsTable)
      .select('*')
      .eq(foreignKey, req.params.id);

    items = fetchedItems || [];

    const wb = XLSX.utils.book_new();

    const json = ext.extracted_json;

    const sections = [
      'job',
      'importer_exporter',
      'foreign_party',
      'consignee',
      'shipment',
      'invoice',
      'packing',
    ];

    for (const sec of sections) {
      if (json[sec]) {
        const rows = Object.entries(json[sec]).map(
          ([k, v]) => ({
            Field: k,
            Value: v?.value || v,
            Confidence: v?.confidence || '',
          })
        );

        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet(rows),
          sec
        );
      }
    }

    if (items?.length) {
      const itemRows = items.map((i) => ({
        Sr: i.sr_no,
        Description: i.item_description,
        HS_Code: i.hs_code,
        Qty: i.quantity,
        Unit: i.unit,
        Price: i.unit_price,
        Total: i.total_value,
      }));

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(itemRows),
        'items'
      );
    }

    const buffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${ext.job_number}.xlsx"`
    );

    res.send(buffer);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// ============================================================
// POST /api/extractions/:id/confirm-hs
// Confirm HS code for any extraction type
// ============================================================
router.post('/:id/confirm-hs', authMiddleware, async (req, res) => {
  const { itemId, hsCode } = req.body;
  if (!itemId || !hsCode) {
    return res.status(400).json({ error: 'itemId and hsCode are required' });
  }

  try {
    const cleanCode = String(hsCode).trim().replace(/\s/g, '');

    // Verify against tariff database
    const { data: tariff, error: tariffError } = await supabase
      .from('hs_codes')
      .select('*')
      .eq('hsn', cleanCode)
      .maybeSingle();

    if (tariffError) throw tariffError;
    if (!tariff) {
      return res.status(400).json({ error: 'HS code does not exist in tariff database' });
    }

    // Determine the items table to update
    let targetTable = 'extraction_items';
    
    // Check if itemId exists in extraction_items
    const { data: standardItem } = await supabase
      .from('extraction_items')
      .select('id')
      .eq('id', itemId)
      .maybeSingle();

    if (!standardItem) {
      // Check scanned_pdf_extraction_items
      const { data: scannedItem } = await supabase
        .from('scanned_pdf_extraction_items')
        .select('id')
        .eq('id', itemId)
        .maybeSingle();

      if (scannedItem) {
        targetTable = 'scanned_pdf_extraction_items';
      } else {
        // Fallback to image_extraction_items
        targetTable = 'image_extraction_items';
      }
    }

    const { error: updateError } = await supabase
      .from(targetTable)
      .update({ user_confirmed_hs: cleanCode })
      .eq('id', itemId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      confirmedCode: cleanCode,
      tariff
    });

  } catch (err) {
    console.error('HS confirmation error:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;