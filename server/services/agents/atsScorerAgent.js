const Groq = require("groq-sdk");

const atsScorerAgent = async (profile, targetCompany) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an ATS (Applicant Tracking System) specialist. You evaluate resumes against company requirements and industry standards. Return only valid JSON, no extra text.",
      },
      {
        role: "user",
        content: `
You are evaluating a candidate applying to ${targetCompany}.

Candidate Profile:
${JSON.stringify(profile, null, 2)}

Score this candidate's resume for ${targetCompany} and return ONLY this JSON:
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
    model: "llama3-8b-8192",
    temperature: 0.3,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

module.exports = atsScorerAgent;





// A hybrid approach could also be there 

// Agent 2 (ATS Scorer) — Hybrid Version:

// Step 1 — Math (our code):
//   matchedCount = profile.skills.filter(
//     skill => companyKeywords.includes(skill)
//   ).length;
//   baseScore = (matchedCount / companyKeywords.length) * 100;

// Step 2 — LLM (for context):
//   "Given this base score of {baseScore} and these matched/missing 
//   keywords, provide qualitative feedback and adjust the score 
//   considering experience relevance and career progression"

// Step 3 — Combine:
//   finalScore = (baseScore * 0.6) + (llmScore * 0.4)

//Note:- Currently it uses LLM-based evaluation — the model draws on its training knowledge of ATS systems and hiring criteria to score resumes. This has the advantage of contextual understanding but lacks auditability. A production improvement would be a hybrid approach — deterministic keyword matching for a base score, combined with LLM evaluation for contextual factors like experience relevance and career progression. I documented this as a known limitation and planned enhancement.