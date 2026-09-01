require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const orchestrate = require("./agents/orchestrator");

const analyzeResume = async (resumeText, targetCompany, jobDescription = '') => {
  try {
    const result = await orchestrate(resumeText, targetCompany, jobDescription);
    return result;
  } catch (error) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

module.exports = { analyzeResume };