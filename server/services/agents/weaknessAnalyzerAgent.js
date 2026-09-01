const Groq = require("groq-sdk");

function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Invalid JSON from Groq:\n", text);
    throw new Error("Failed to parse JSON from Groq response");
  }
}

function normalizeArray(arr) {
  return arr.map(item =>
    typeof item === "object" ? JSON.stringify(item) : String(item)
  );
}

const weaknessAnalyzerAgent = async (profile, atsResult, targetCompany, jobDescription = '') => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const jobDescriptionSection = jobDescription
    ? `\nActual Job Description provided by candidate:\n${jobDescription}\n`
    : `\n(No job description provided — use general ${targetCompany} requirements)\n`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a career coach specialist. Identify skill gaps and weaknesses in candidates and provide actionable improvement advice. " +
          "Return only valid JSON. All values must be plain strings or arrays of strings. Do not return objects inside arrays unless explicitly required.",
      },
      {
        role: "user",
        content: `
You are analyzing a candidate applying to ${targetCompany}.
${jobDescriptionSection}
Candidate Profile:
${JSON.stringify(profile, null, 2)}

ATS Analysis Results:
${JSON.stringify(atsResult, null, 2)}

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
    model: "openai/gpt-oss-20b",
    temperature: 0.4,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = safeParseJSON(cleaned);

  if (Array.isArray(parsed.missingSkills)) {
    parsed.missingSkills = normalizeArray(parsed.missingSkills);
  }
  if (Array.isArray(parsed.priorityActions)) {
    parsed.priorityActions = normalizeArray(parsed.priorityActions);
  }

  return parsed;
};

module.exports = weaknessAnalyzerAgent;