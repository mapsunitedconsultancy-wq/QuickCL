const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const scannedFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf'];
  const allowedMimeTypes = ['application/pdf', 'application/x-pdf'];

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExtensions.includes(ext);
  const isValidMime = allowedMimeTypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Only valid PDF files are allowed for scanned PDF extraction'), false);
  }
};

const scannedUpload = multer({
  storage,
  fileFilter: scannedFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max limit (Gemini's inline data limit)
});

module.exports = scannedUpload;
