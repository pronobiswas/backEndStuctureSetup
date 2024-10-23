const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
    title: {
        type: String,
        required: [true, "category  required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description  required"],
        trim: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    subcategory: [{
        type: Schema.Types.ObjectId,
        ref: "subcategory"
    }]
})
module.exports = mongoose.model('category', categorySchema)