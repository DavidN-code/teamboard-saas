require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInvitationEmail = async (email, inviteLink) => {

  try {
    const response = await resend.emails.send({
      from: "TeamBoard <onboarding@resend.dev>",
      to: email,
      subject: "You're invited to join TeamBoard",
      html: `
        ...
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