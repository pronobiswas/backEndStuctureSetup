const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
const ordermodel = require("../Model/order.Model");

const palceOrder = async(req,res)=>{
    try {
        const userinfo = req.user;
        const token = req.headers.authorization;
        console.log(token);
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = { palceOrder};