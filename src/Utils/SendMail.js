const nodemailer = require("nodemailer");
const { MakeTemplate } = require("../Helper/emailTamplate");
const sendMail = async (emailAddress, firstName, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.HOST_MAIL,
      to: `${emailAddress}`,
      subject: "Hello ✔",
      html: MakeTemplate(firstName, otp,emailAddress),
    });
    return info;
  } catch (error) {
    console.log(`From sent mail function : ${error}`);
  }
};
module.exports = { sendMail };
