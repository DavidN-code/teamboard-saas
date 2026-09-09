require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvitationEmail = async (email, inviteLink) => {

  try {
    const response = await resend.emails.send({
      from: "TeamBoard <invites@teamboardhq.com>",
      to: email,
      subject: "You're invited to join TeamBoard",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #222;">
    <h2 style="margin-bottom: 16px;">You're invited to join TeamBoard</h2>

    <p style="font-size: 16px; line-height: 1.6;">
      You've been invited to join a TeamBoard organization.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Click the button below to accept your invitation and create your account.
    </p>

    <div style="margin: 28px 0;">
      <a
        href="${inviteLink}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Accept Invitation
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p style="font-size: 14px; word-break: break-all;">
      <a href="${inviteLink}">${inviteLink}</a>
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 32px;">
      If you weren't expecting this invitation, you can ignore this email.
    </p>
  </div>
`,
    });
    
    if (response.error) {
      console.error(
        `❌ Invitation email failed for ${email}:`,
        response.error
      );
    
      throw new Error(response.error.message);
    }
    
    console.log(
      `✅ Invitation email sent to ${email}`,
      response.data
    );
    
    return response.data;

  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw new Error("Failed to send invitation email");
  }
};

module.exports = sendInvitationEmail;