const EXTRACTION_PROMPT = require('./extractionPrompt');

const SCANNED_EXTRACTION_PROMPT = EXTRACTION_PROMPT + `

============================================================
CRITICAL OVERRIDES FOR SCANNED PDF PROCESSING (MULTIMODAL)
============================================================
The document you are processing is a SCANNED PDF. This means it is not a pristine digital file; it consists of photographs or scans of physical paper. You must engage your advanced vision capabilities to forensically reconstruct the data.

1. FORENSIC VISUAL RECOVERY (NOISE & OBSTRUCTIONS)
------------------------------------------------------------
- STAMPS & SIGNATURES: Official customs stamps, bank seals, and handwritten signatures often overlap printed text. You must carefully look "under" or "through" the ink to extract the printed characters beneath. Do not let a stamp cause you to truncate a value.
- ARTIFACT REJECTION: Ignore physical document damage such as hole punches, staple marks, folded corners, scanner dust, shadow gradients, and skewed (tilted) pages.
- HANDWRITTEN ANNOTATIONS: If a value has been crossed out with a pen and a new value is handwritten next to it, extract the NEW handwritten value.

2. ADVANCED CHARACTER DISAMBIGUATION
------------------------------------------------------------
Scanned documents suffer from low DPI and pixel degradation. Use structural context to resolve ambiguous characters:
- O vs 0 / I vs 1: If reading an amount/price, it is a number. If reading a Currency Code (e.g., USD, INR), it is a letter.
- Commas vs. Periods: In Indian numbering systems, be extremely careful not to confuse a thousands-separator comma for a decimal point due to blurry print (e.g., "1,250.00" vs "1.250.00").
- Checksums/Formats: Use standard Indian formatting rules to guide your eyes. 
  * IEC codes are typically 10 digits.
  * PAN is 10 characters (5 letters, 4 numbers, 1 letter).
  * GSTIN is 15 characters (starting with 2-digit state code, followed by PAN).
  * HS / RITC codes are purely numeric (4, 6, or 8 digits).

3. MULTI-PAGE TABLE STITCHING (CRITICAL)
------------------------------------------------------------
In scanned PDFs, line-item tables frequently break across physical pages.
- CONTINUOUS ARRAYS: If a table of items reaches the bottom of Page 1 and continues on Page 2, you MUST merge them into a single, continuous JSON array. 
- REPEATED HEADERS: Ignore repeated table headers at the top of the new page. Do not extract the header text as a product description.
- ORPHANED DESCRIPTIONS: If a product description starts on Page 1 but finishes on Page 2, concatenate the text smoothly into the same line-item object.

4. ALIGNMENT & SKEW CORRECTION
------------------------------------------------------------
- SPATIAL SHIFTING: Scanners often feed paper at a slight angle (skew). You must virtually "straighten" the rows in your mind. Ensure that a Quantity located slightly higher or lower than its Description is still mapped to the correct row index.
- INVISIBLE GRIDS: Scanned tables often lack printed gridlines. Rely on vertical text justification (left-aligned descriptions vs. right-aligned numbers) to determine which column a number belongs to.

5. CHECKBOXES AND FORMS
------------------------------------------------------------
- If a scanned form uses checkboxes (e.g., [x] EPCG   [ ] Advance Licence), extract the value corresponding to the marked box.
- Treat "X", checkmarks, or filled-in scribbles as a positive boolean or selected choice.

By following these forensic visual rules, you will reconstruct the dirty scan into pristine, accurate JSON.
`;

module.exports = SCANNED_EXTRACTION_PROMPT;