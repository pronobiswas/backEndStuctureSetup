const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
const ordermodel = require("../Model/order.Model");

const palceOrder = async(req,res)=>{
    try {
        const userinfo = req.user;
        const token = req.headers.authorization;
        const userId = userinfo.id
        // const {firstName,lastName,emailAddress,telePhone,address1,address2,city,district,postCode} = req.body;
        // const {paymentmethod,ispaid}=req.body;
        const {cartItem,customerinfo,paymentinfo,status,subTotal,totalQuantity} =req.body;
        console.log(cartItem,customerinfo,paymentinfo,status,subTotal,totalQuantity);
        

        
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = { palceOrder};