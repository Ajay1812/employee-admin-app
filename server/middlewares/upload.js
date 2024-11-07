const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageDir = path.join(__dirname, '../assets/images');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname; // Use timestamp to avoid conflicts
        cb(null, uniqueName);
    }
    
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
      cb(null, true);
  } else {
      cb(new Error('Only .jpg, .jpeg, .png, and .gif formats are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
