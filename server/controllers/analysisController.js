const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");

const analyzeUserResume = async (req, res) => {
  try {
    const { resumeId, targetCompany } = req.body;

    if (!resumeId || !targetCompany) {
      return res.status(400).json({ 
        message: "Resume ID and target company are required" 
      });
    }

    const resume = await Resume.findOne({ 
      _id: resumeId, 
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const analysis = await analyzeResume(resume.extractedText, targetCompany);

    res.status(200).json({
      message: "Resume analyzed successfully",
      fileName: resume.fileName,
      targetCompany,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { analyzeUserResume };