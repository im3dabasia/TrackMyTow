const postmark = require("postmark");
require("dotenv").config();

const sendEmailToUsers = async (emailID, templateID, data) => {
  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);

    const emailOptions = {
      From: process.env.EMAIL,
      To: emailID,
      TemplateId: templateID,
      TemplateModel: data,
    };
    console.log("Data: ", data);
    // const response = await client.sendEmailWithTemplate(emailOptions);
    console.log(`Email sent:`, response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

const notifyUsersForTow = async (
  emailID,
  linkId,
  userName,
  usernumberPlate,
  templateID
) => {
  try {
    if (emailID.length <= 0 || !linkId) {
      console.log("Empty email Array || linkId missing");
      return;
    }
    const data = {
      linkID: `${linkId}`,
      userName: `${userName}`,
      usernumberPlate: `${usernumberPlate}`,
    };
    console.log("Notify users data: ", data);
    await sendEmailToUsers(emailID, templateID, data);
    console.log("Emails sent successfully to users.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = notifyUsersForTow;
