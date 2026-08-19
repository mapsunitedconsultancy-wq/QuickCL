const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractAllDataFromScannedPDF(files, prompt) {
    const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite"
    });

    const pdfParts = files.map(file => ({
        inlineData: {
            data: file.buffer.toString("base64"),
            mimeType: file.mimetype || "application/pdf"
        }
    }));

    const result = await model.generateContent([
        prompt,
        ...pdfParts
    ]);

    const response = result.response;
    let text = response.text();

    // Clean markdown JSON formatting if present
    text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        console.error("Gemini scanned PDF JSON parse error:");
        console.error(text);
        throw new Error("Gemini returned invalid JSON for scanned PDF extraction.");
    }

    return parsed;
}

module.exports = {
    extractAllDataFromScannedPDF
};
