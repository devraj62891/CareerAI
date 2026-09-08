const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (name, email) => {
  await resend.emails.send({
    from: "CareerAI <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to CareerAI! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a2e;">Welcome to CareerAI, ${name}! 👋</h1>
        <p style="font-size: 16px; color: #333;">
          Your account has been created successfully. You're now ready to supercharge your interview preparation.
        </p>
        <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a1a2e; margin-top: 0;">What you can do with CareerAI:</h3>
          <ul style="color: #333; font-size: 15px;">
            <li>📄 Upload your resume (PDF)</li>
            <li>🎯 Target specific companies</li>
            <li>🤖 Get AI-powered ATS scoring</li>
            <li>💡 Discover your skill gaps</li>
            <li>❓ Get personalized interview questions</li>
          </ul>
        </div>
        <p style="font-size: 16px; color: #333;">
          Ready to land your dream job?
          <a href="https://careerai-baceknd.onrender.com" style="color: #4f46e5;">Start now →</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">
          This email was sent by CareerAI. If you didn't sign up, please ignore this email.
        </p>
      </div>
    `,
  });

  console.log(`✅ Welcome email sent to ${email}`);
};

module.exports = { sendWelcomeEmail };