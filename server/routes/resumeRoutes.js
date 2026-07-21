const express = require("express");
const router = express.Router();
const { uploadResume } = require("../controllers/resumeController");
const { protect } = require("../middlewares/authMiddlewares");
const upload = require("../config/multer");

// Upload route — three-part middleware chain
router.post("/upload", protect, upload.single("resume"), uploadResume);

//upload.single("resume")- it means -I expect one file in this request, sent under the field name resume.
//.single() means one file. If you wanted multiple files you'd use .array("resumes", 5) (up to 5 files). But we need just one resume at a time.

module.exports = router;