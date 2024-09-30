const nodemailer = require("nodemailer");
const { MakeTemplate } = require("../Helper/emailTamplate");
const sendMail = async (EmailAddress,FirstName,otp) => {
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
      to: `${EmailAddress}`, 
      subject: "Hello ✔", 
      html: MakeTemplate(FirstName,otp),
    });
    return info
  } catch (error) {
    console.log(`From sent mail function : ${error}`);
  }
};
module.exports = {sendMail}