require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvitationEmail = async (email, inviteLink) => {
  console.log("🔥 sendInvitationEmail CALLED");

  try {
    const response = await resend.emails.send({
      from: "TeamBoard <onboarding@resend.dev>",
      to: email,
      subject: "You're invited to join TeamBoard",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>You're invited to TeamBoard</h2>

          <p>
            You have been invited to join an organization on TeamBoard.
          </p>

          <p>
            Click the button below to accept your invitation:
          </p>

          <a
            href="${inviteLink}"
            style="
              display:inline-block;
              padding:12px 18px;
              background:#4f46e5;
              color:white;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            "
          >
            Accept Invitation
          </a>

          <p style="margin-top:20px;">
            If the button doesn't work, copy and paste this link:
          </p>

          <p>${inviteLink}</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", response);

    return response;

  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw new Error("Failed to send invitation email");
  }
};

module.exports = sendInvitationEmail;