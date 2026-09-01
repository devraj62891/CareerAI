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

const atsScorerAgent = async (profile, targetCompany, jobDescription = '') => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const jobDescriptionSection = jobDescription
    ? `\nActual Job Description provided by candidate:\n${jobDescription}\n`
    : `\n(No job description provided — use general ${targetCompany} requirements)\n`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an ATS (Applicant Tracking System) specialist. Evaluate resumes against company requirements and industry standards. " +
          "Return only valid JSON. All values must be plain strings or arrays of strings.",
      },
      {
        role: "user",
        content: `
You are evaluating a candidate applying to ${targetCompany}.
${jobDescriptionSection}
Candidate Profile:
${JSON.stringify(profile, null, 2)}

Return ONLY this JSON:
{
  "atsScore": <number between 0-100>,
  "atsFeedback": "<one sentence explaining the score>",
  "keywordsMatched": ["<keyword1>", "<keyword2>"],
  "keywordsMissing": ["<keyword1>", "<keyword2>"],
  "formatFeedback": "<one sentence about resume format and structure>"
}
        `,
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = safeParseJSON(cleaned);

  if (Array.isArray(parsed.keywordsMatched)) {
    parsed.keywordsMatched = normalizeArray(parsed.keywordsMatched);
  }
  if (Array.isArray(parsed.keywordsMissing)) {
    parsed.keywordsMissing = normalizeArray(parsed.keywordsMissing);
  }

  return parsed;
};

module.exports = atsScorerAgent;