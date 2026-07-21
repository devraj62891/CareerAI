const multer = require("multer");

// Store the uploaded file in memory (buffer) — we only need it briefly to extract text
const storage = multer.memoryStorage();//memoryStorage is for ram because we need them tmeporarly and diskstorage is for rom ehen we want to keep them forevere
    


// Only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);   // accept
  } else {
    cb(new Error("Only PDF files are allowed"), false);  // reject
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;


//this can also be done

// const myPdfChecker = (req, file, cb) => { ... };   // any name

// const upload = multer({
//   storage: storage,
//   fileFilter: myPdfChecker,   // key MUST be "fileFilter", value can be anything
//   limits: { fileSize: 5 * 1024 * 1024 },
// });