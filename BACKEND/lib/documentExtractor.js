const path = require("path");

const { extractTextFromImage } = require("./imageOCR");
const { extractTextFromPDF } = require("./pdfExtractor");

/**
 * Main document extraction function.
 * Decides automatically how to extract text.
 */
async function extractDocument(file) {

    const ext = path.extname(file.originalname).toLowerCase();

    console.log("\n==============================");
    console.log("Processing:", file.originalname);
    console.log("Type:", file.mimetype);

    //------------------------------------
    // IMAGE
    //------------------------------------

    if (
        [
            ".jpg",
            ".jpeg",
            ".png",
            ".heic",
            ".tif",
            ".tiff"
        ].includes(ext)
    ) {

        console.log("Detected IMAGE");
        console.log("Using Google Vision OCR");

        const text = await extractTextFromImage(file.buffer);

        return text;
    }

    //------------------------------------
    // PDF
    //------------------------------------

    if (ext === ".pdf") {

        console.log("Detected PDF");

        const pdf = await extractTextFromPDF(file.buffer);

        //------------------------------------
        // DIGITAL PDF
        //------------------------------------

        if (!pdf.isScanned) {

            console.log("Digital PDF detected");
            console.log("Skipping OCR");

            return pdf.text;
        }

        //------------------------------------
        // SCANNED PDF
        //------------------------------------

        console.log("Scanned PDF detected");
        console.log("OCR fallback required");

        throw new Error(
            "Scanned PDF detected. OCR fallback is not implemented yet."
        );
    }

    //------------------------------------

    throw new Error("Unsupported file format.");
}

module.exports = {
    extractDocument
};