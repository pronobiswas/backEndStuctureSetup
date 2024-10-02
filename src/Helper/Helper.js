const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===pasword encription=========
const bcryptPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password , 10);
        return hashPassword
    } catch (error) {
        console.log(error);
    }
}; 
// =======Dycript password=======
const decodeHashPassword = async (plainPassword, encryptedPassword) => {
  const passwordResult = await bcrypt.compare(plainPassword, encryptedPassword);
  return passwordResult;
};
// ========OTP generator====
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
module.exports = {bcryptPassword,decodeHashPassword,generateAccesToken}
