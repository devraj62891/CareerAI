const Groq = require("groq-sdk");
const { jsonrepair } = require("jsonrepair");

// Helper: safe JSON parsing with repair + logging
function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn("⚠️ JSON malformed, attempting repair...");
    try {
      const repaired = jsonrepair(text);
      return JSON.parse(repaired);
    } catch (repairErr) {
      console.error("❌ Could not repair JSON:\n", text);
      throw new Error("Failed to parse or repair JSON from Groq response");
    }
  }
}

const questionGeneratorAgent = async (profile, atsResult, weaknessResult, targetCompany) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical interviewer at a top tech company. " +
          "You generate highly targeted interview questions based on a candidate's specific profile, weaknesses, and target company. " +
          "Return only valid JSON, no extra text. All arrays must contain plain strings, not objects.",
      },
      {
        role: "user",
        content: `
You are preparing interview questions for a candidate applying to ${targetCompany}.

Candidate Profile:
${JSON.stringify(profile, null, 2)}

ATS Analysis:
${JSON.stringify(atsResult, null, 2)}

Weakness Analysis:
${JSON.stringify(weaknessResult, null, 2)}

Generate 10 highly targeted interview questions based on ALL the above context.
Focus questions on:
1. The candidate's actual skills (from profile)
2. Their weakness areas (from weakness analysis)
3. Missing keywords (from ATS analysis)
4. ${targetCompany} specific requirements

Return ONLY this JSON:
{
  "interviewQuestions": [
    {
      "question": "<specific question>",
      "category": "<Technical/Behavioral/HR>",
      "difficulty": "<Easy/Medium/Hard>",
      "targetArea": "<which skill or weakness this targets>",
      "whyAsked": "<why ${targetCompany} would ask this>"
    }
  ],
  "focusAreas": ["<area1>", "<area2>", "<area3>"],
  "interviewTips": "<2-3 sentence specific advice for this candidate at ${targetCompany}>"
}
        `,
      },
    ],
    model: "openai/gpt-oss-20b",   // ✅ supported model
    temperature: 0.7,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return safeParseJSON(cleaned);
};

module.exports = questionGeneratorAgent;
