const pdf = require("pdf-parse");

/**
 * Extract text from DIGITAL PDFs.
 * If very little text is found,
 * the PDF is probably scanned.
 */

async function extractTextFromPDF(buffer) {
    const data = await pdf(buffer);

    const text = (data.text || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return {
        text,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata,

        // heuristic
        isScanned: text.length < 50
    };
}

module.exports = {
    extractTextFromPDF
};