const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const analyzeResume = async (resumeText, targetCompany) => {
    try {
        const prompt = `
You are an expert technical interviewer and resume analyst.

Analyze the following resume for a candidate applying to ${targetCompany}.

Resume:
${resumeText}

Provide a JSON response with exactly this structure (no extra text, just JSON):
{
  "atsScore": <number between 0-100>,
  "atsFeedback": "<one sentence explaining the ATS score>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "interviewQuestions": [
    {
      "question": "<interview question>",
      "category": "<Technical/Behavioral/HR>",
      "difficulty": "<Easy/Medium/Hard>"
    }
  ],
  "overallFeedback": "<2-3 sentences of overall resume feedback>"
}

Generate 8-10 interview questions relevant to the candidate's skills and the target company.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedResponse = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(cleanedResponse);
        return analysis;
    } catch (error) {
        throw new Error(`AI analysis failed: ${error.message}`);
    }
};

module.exports = { analyzeResume };