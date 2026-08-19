const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const scannedFileFilter = (req, file, cb) => {
  const allowed = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for scanned PDF extraction'), false);
  }
};

const scannedUpload = multer({
  storage,
  fileFilter: scannedFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max limit (Gemini's inline data limit)
});

module.exports = scannedUpload;
