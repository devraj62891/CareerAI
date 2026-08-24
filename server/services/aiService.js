require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Groq = require("groq-sdk");

const analyzeResume = async (resumeText, targetCompany) => {
  try {
    // Initialize INSIDE the function so env vars are loaded first
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
                        You are an expert technical interviewer and resume analyst.
                        Analyze the following resume for a candidate applying to ${targetCompany}.
                        Resume:
                        ${resumeText}
                        Provide a JSON response with exactly this structure (no extra text, just JSON):
                        {
                          "atsScore": <number between 0-100>,
                          "atsFeedback": "<one sentence>",
                          "strengths": ["<s1>", "<s2>", "<s3>"],
                          "weaknesses": ["<w1>", "<w2>", "<w3>"],
                          "interviewQuestions": [
                            {
                              "question": "<question>",
                              "category": "<Technical/Behavioral/HR>",
                              "difficulty": "<Easy/Medium/Hard>"
                            }
                          ],
                          "overallFeedback": "<2-3 sentences>"
                        }
                        Generate 8-10 interview questions.
                  `,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || "";
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
