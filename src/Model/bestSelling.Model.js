const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const BestSellingProductSchema = new Schema({
    product:{
        type:Types.ObjectId,
        ref:"products",
    }
})
module.exports= mongoose.model("bestSellingProducts",BestSellingProductSchema)