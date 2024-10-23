const { ApiError } = require("../Utils/ApiError");
const jwt = require('jsonwebtoken');

const authGuard = async (req, res, next) => {
  try {
    const { Cookie, authorization } = req.headers;
    console.log(Cookie);
    console.log("hello");
    
    
    
    
  } catch (error) {
    console.log(`This is authGaurd Error : ${error}`);
  }
};
module.exports = { authGuard }