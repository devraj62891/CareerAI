const Groq = require("groq-sdk");

const resumeAnalyzerAgent = async (resumeText) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a resume parsing specialist. Your only job is to extract structured information from resumes. Return only valid JSON, no extra text.",
      },
      {
        role: "user",
        content: `
Extract structured information from this resume.
Return ONLY this JSON structure, no extra text:
{
  "fullName": "<candidate name>",
  "currentRole": "<current or most recent job title>",
  "totalExperience": "<e.g. 2 years, fresher>",
  "skills": ["<skill1>", "<skill2>"],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. 1 year 2 months>"
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<college/university>",
      "year": "<graduation year>"
    }
  ],
  "certifications": ["<cert1>", "<cert2>"],
  "summary": "<2 sentence professional summary of this candidate>"
}

Resume:
${resumeText}
        `,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.3,//lower the temorate more the predictable
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

module.exports = resumeAnalyzerAgent;