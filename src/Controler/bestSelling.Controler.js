const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const bestSellingModel = require('../Model/bestSelling.Model.js')


const CreateBestsellingControler = async(req,res)=>{
    try {
        console.log(req.body);
        console.log("best selling products");
        
        
    } catch (error) {
        return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `CreateBestsellingControler Error:  ${error} !!`
        )
      );
    }
}
module.exports = {CreateBestsellingControler}