const { ApiError } = require("../Utils/ApiError");

const authGuard = async (req, res, next) => {
  try {
    const token = res.token;
    console.log(token);
    console.log("hello");
    
    
    
    
  } catch (error) {
    console.log(`This is authGaurd Error : ${error}`);
  }
};
