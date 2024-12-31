const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const {Schema, Types} = mongoose;

const flashSaleSchema = new Schema({

    productId:{
        type:Types.ObjectId,
        ref:"product",
        required:true
    },

},{Timestamp:true})

module.exports = mongoose.model("flashSaleProduct" , flashSaleSchema)