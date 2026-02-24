// Multer configuration (upload.js)
const multer = require('multer');

const storage = path =>
  multer.diskStorage({
    destination: './uploads/' + path,
    filename: (req, files, cb) => {
      cb(null, `${Date.now()}-${files.originalname}`);
    },
  });

const upload = path =>
  multer({
    storage: storage(path),
    fileFilter: (req, files, cb) => {
      if (
        files.mimetype === 'image/png' ||
        files.mimetype === 'image/jpg' ||
        files.mimetype === 'image/webp' ||
        files.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Seuls les formats .png, .jpg et .jpeg .webp sont autorisés !'));
      }
    },
  });

module.exports = upload;
