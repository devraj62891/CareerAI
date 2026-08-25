const Groq = require("groq-sdk");

const weaknessAnalyzerAgent = async (profile, atsResult, targetCompany) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a career coach specialist. You identify skill gaps and weaknesses in candidates and provide actionable improvement advice. Return only valid JSON, no extra text.",
      },
      {
        role: "user",
        content: `
You are analyzing a candidate applying to ${targetCompany}.

Candidate Profile:
${JSON.stringify(profile, null, 2)}

ATS Analysis Results:
${JSON.stringify(atsResult, null, 2)}

Based on the profile AND the ATS results above, identify weaknesses and gaps.
Return ONLY this JSON:
{
  "weaknesses": [
    {
      "area": "<skill or area name>",
      "description": "<why this is a weakness>",
      "howToImprove": "<specific actionable advice>"
    }
  ],
  "missingSkills": ["<skill1>", "<skill2>"],
  "experienceGaps": "<one sentence about experience gaps if any>",
  "overallReadiness": "<Not Ready / Partially Ready / Ready>",
  "priorityActions": ["<action1>", "<action2>", "<action3>"]
}
        `,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.4,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

module.exports = weaknessAnalyzerAgent;