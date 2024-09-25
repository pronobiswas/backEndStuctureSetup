const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bcryptPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password , 10);
        return hashPassword
    } catch (error) {
        console.log(error);
    }
}; 
const generateAccesToken = async (EmailAddress, TelePhone) => {
    const AccessToken = await jwt.sign(
      {
        EmailAddress,
        TelePhone,
      },
       `8bCz-4buc`,
      { expiresIn: "1d" }
    );
  
    return AccessToken;
  };
module.exports = {bcryptPassword,generateAccesToken}
