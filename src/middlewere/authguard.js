const { ApiError } = require("../Utils/ApiError");
const jwt = require("jsonwebtoken");

const authGuard = async (req, res, next) => {
  try {
    // =====get the token from headers====
    const { cookie, authorization } = req.headers;
    const cookiesToken = cookie?.split("=")[1];

    if (authorization ) {
      // ====verify token===
      const decoded = jwt.verify(
        authorization.trim(),
        process.env.ACCCESS_TOKEN_SCCRECT || "8bCz-4buc"
      );
      if (decoded) {
        req.user = decoded;
        next();
      }
    } else if (cookiesToken) {
      const decoded = jwt.verify(
        cookiesToken,
        process.env.ACCCESS_TOKEN_SCCRECT || "8bCz-4buc"
      );
      if (decoded) {
        req.user = decoded;
        next();
      }
    }
  } catch (error) {
    console.log(`This is authGaurd Error : ${error}`);
    new ApiError(
      false,
      null,
      401,
      "Authenticition Fails, Please sign in Again...!"
    );
  }
};
module.exports = { authGuard };
