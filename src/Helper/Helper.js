const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===pasword encription=========
const bcryptPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};
// =======Dycript password=======
const decodeHashPassword = async (plainPassword, encryptedPassword) => {
  const passwordResult = await bcrypt.compare(plainPassword, encryptedPassword);
  return passwordResult;
};
// ========token generator====
const generateAccesToken = async (EmailAddress , id) => {
  const AccessToken = await jwt.sign(
    {
      EmailAddress,
      id
    },
    process.env.ACESS_TOKEN_SCERECT || `8bCz-4buc`,
    { expiresIn: "1d" }
  );

  return AccessToken;
};
module.exports = { bcryptPassword, decodeHashPassword, generateAccesToken };
