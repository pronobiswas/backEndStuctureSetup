const { ApiError } = require("../Utils/ApiError");

const authGuard = async (req, res, next) => {
  try {
    console.log(req,res);
    
  } catch (error) {
    console.log(`This is authGaurd Error : ${error}`);
  }
};
