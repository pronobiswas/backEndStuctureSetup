const mongoose = require('mongoose');
const { Schema } = mongoose;

const marchantSchema = new Schema({
    EmailAddress: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Email Required "]
    }
    ,
    TelePhone: {
        type: Number,
        trim: true,
        required: [true, "phoneNumber Required "]
    },
    StoreName: {
        type: String,
        trim: true,
        required: [true, "Store Name  Required "]
    },
    Address1: {
        type: String,
        trim: true,
    },
    Users: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    Products: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    Status: {
        type: String,
        enum: ["pending", "Rejected", "Approved"],
        default: "pending"
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('store', marchantSchema);