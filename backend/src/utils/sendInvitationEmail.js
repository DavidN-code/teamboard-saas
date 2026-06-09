require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvitationEmail = async (email, inviteLink) => {
    console.log("🔥 sendInvitationEmail CALLED");

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  try {
    await transporter.sendMail({
      from: `"TeamBoard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're invited to join TeamBoard",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>You're invited to TeamBoard</h2>
          <p>You have been invited to join an organization on TeamBoard.</p>
          <p>
            Click below to accept your invitation:
          </p>
          <a href="${inviteLink}" style="padding:10px 15px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">
            Accept Invitation
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Failed to send invitation email");
  }
};

module.exports = sendInvitationEmail;