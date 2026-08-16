const axios = require("axios");

const apiKey = process.env.GOOGLE_CLOUD_CREDENTIALS;

async function extractTextFromImage(buffer) {
  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: {
              content: buffer.toString("base64"),
            },
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION",
              },
            ],
            imageContext: {
              languageHints: ["en"],
            },
          },
        ],
      }
    );

    if (response.data.responses?.[0]?.error) {
      throw new Error(response.data.responses[0].error.message);
    }

    return response.data.responses?.[0]?.fullTextAnnotation?.text || "";
  } catch (err) {
    console.error("Google Vision Error:");
    console.error(err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  extractTextFromImage,
};