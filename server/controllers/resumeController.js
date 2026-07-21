const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");

// UPLOAD RESUME - receive PDF, extract text, save to DB
const uploadResume = async (req, res) => {
  try {
    // 1. Check a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 2. Extract text from the PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    // 3. Make sure we actually got some text
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: "Could not read text from PDF" });
    }

    // 4. Save to database, linked to the logged-in user
    const resume = await Resume.create({
      user: req.user.id,              // comes from the protect middleware
      fileName: req.file.originalname,
      extractedText: extractedText,
    });

    // 5. Send success response
    res.status(201).json({
      message: "Resume uploaded and processed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        textPreview: extractedText.substring(0, 200) + "...", // first 200 chars
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadResume };