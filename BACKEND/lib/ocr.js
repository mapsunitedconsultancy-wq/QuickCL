const axios = require("axios");

const apiKey = process.env.GOOGLE_CLOUD_CREDENTIALS;

async function extractTextFromImage(buffer) {
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
        },
      ],
    }
  );

  return (
    response.data.responses?.[0]?.fullTextAnnotation?.text || ""
  );
}

module.exports = { extractTextFromImage };