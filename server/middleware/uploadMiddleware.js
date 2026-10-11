const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, TXT, and DOC/DOCX files are supported.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter
});

module.exports = upload;