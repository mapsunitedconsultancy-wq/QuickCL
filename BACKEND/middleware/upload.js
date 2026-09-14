const multer = require('multer');
const path = require('path');

// Store files temporarily in memory (we upload to Supabase Storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf'];
  const allowedMimeTypes = ['application/pdf', 'application/x-pdf'];

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExtensions.includes(ext);
  const isValidMime = allowedMimeTypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only standard PDF documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max LIMIT
});

module.exports = upload;