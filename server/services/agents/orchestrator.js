// server/services/aiService.js

const resumeAnalyzerAgent = require("./resumeAnalyzerAgent");
const atsScorerAgent = require("./atsScorerAgent");
const weaknessAnalyzerAgent = require("./weaknessAnalyzerAgent");
const questionGeneratorAgent = require("./questionGeneratorAgent");

const orchestrate = async (resumeText, targetCompany, jobDescription = '') => {
  console.log("🤖 Orchestrator started...");
  console.log("📋 Job description provided:", jobDescription ? "YES" : "NO");

  try {
    console.log("📄 Agent 1: Analyzing resume...");
    const profile = await resumeAnalyzerAgent(resumeText);
    console.log("✅ Agent 1 complete:", profile.fullName);

    console.log("📊 Agent 2: Scoring ATS...");
    const atsResult = await atsScorerAgent(profile, targetCompany, jobDescription);
    console.log("✅ Agent 2 complete. ATS Score:", atsResult.atsScore);

    console.log("🔍 Agent 3: Analyzing weaknesses...");
    const weaknessResult = await weaknessAnalyzerAgent(profile, atsResult, targetCompany, jobDescription);
    console.log("✅ Agent 3 complete. Readiness:", weaknessResult.overallReadiness);

    console.log("❓ Agent 4: Generating questions...");
    const questionResult = await questionGeneratorAgent(profile, atsResult, weaknessResult, targetCompany, jobDescription);
    console.log("✅ Agent 4 complete. Questions:", questionResult.interviewQuestions.length);

    console.log("🎯 Orchestrator complete!");

    return {
      candidate: profile,
      atsScore: atsResult.atsScore,
      atsFeedback: atsResult.atsFeedback,
      keywordsMatched: atsResult.keywordsMatched,
      keywordsMissing: atsResult.keywordsMissing,
      formatFeedback: atsResult.formatFeedback,
      weaknesses: weaknessResult.weaknesses,
      missingSkills: weaknessResult.missingSkills,
      experienceGaps: weaknessResult.experienceGaps,
      overallReadiness: weaknessResult.overallReadiness,
      priorityActions: weaknessResult.priorityActions,
      interviewQuestions: questionResult.interviewQuestions,
      focusAreas: questionResult.focusAreas,
      interviewTips: questionResult.interviewTips,
    };
  } catch (error) {
    console.error("❌ Orchestrator failed:", error.message);
    throw error;
  }
};

module.exports = orchestrate;
