const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");

const analyzeUserResume = async (req, res) => {
  try {
    const { resumeId, targetCompany } = req.body;
    console.log("Incoming request:", { resumeId, targetCompany });

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    console.log("Resume found:", resume?.fileName);

    const analysis = await analyzeResume(resume.extractedText, targetCompany);
    console.log("Analysis result:", analysis);

    res.status(200).json({
      message: "Resume analyzed successfully",
      fileName: resume.fileName,
      targetCompany,
      analysis,
    });
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { analyzeUserResume };