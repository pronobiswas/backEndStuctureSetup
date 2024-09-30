const nodemailer = require("nodemailer");
const sendMail = async (EmailAddress) => {
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
      html: "<b>Hello world?</b>",
    });
    return info
  } catch (error) {
    console.log(`From sent mail function : ${error}`);
  }
};
module.exports = {sendMail}