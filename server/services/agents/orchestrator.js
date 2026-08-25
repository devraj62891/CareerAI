const resumeAnalyzerAgent = require("./resumeAnalyzerAgent");
const atsScorerAgent = require("./atsScorerAgent");
const weaknessAnalyzerAgent = require("./weaknessAnalyzerAgent");
const questionGeneratorAgent = require("./questionGeneratorAgent");

const orchestrate = async (resumeText, targetCompany) => {
  console.log("🤖 Orchestrator started...");

  // Step 1 — Extract structured profile from raw resume
  console.log("📄 Agent 1: Analyzing resume...");
  const profile = await resumeAnalyzerAgent(resumeText);
  console.log("✅ Agent 1 complete:", profile.fullName);

  // Step 2 — Score ATS using the structured profile
  console.log("📊 Agent 2: Scoring ATS...");
  const atsResult = await atsScorerAgent(profile, targetCompany);
  console.log("✅ Agent 2 complete. ATS Score:", atsResult.atsScore);

  // Step 3 — Analyze weaknesses using profile + ATS results
  console.log("🔍 Agent 3: Analyzing weaknesses...");
  const weaknessResult = await weaknessAnalyzerAgent(profile, atsResult, targetCompany);
  console.log("✅ Agent 3 complete. Readiness:", weaknessResult.overallReadiness);

  // Step 4 — Generate targeted questions using all previous results
  console.log("❓ Agent 4: Generating questions...");
  const questionResult = await questionGeneratorAgent(profile, atsResult, weaknessResult, targetCompany);
  console.log("✅ Agent 4 complete. Questions generated:", questionResult.interviewQuestions.length);

  console.log("🎯 Orchestrator complete. Combining results...");

  // Combine all agent outputs into one final response
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
};

module.exports = orchestrate;