const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const orderSchema = new Schema(
    {
      user: {
        type: String,
        required: true,
      },
      cartItem: [
        {
          type: Types.ObjectId,
          ref: "userCart",
        },
      ],
      customerinfo: {
        firstName: {
          type: String,
          trim: true,
        },
        lastName: {
          type: String,
          trim: true,
        },
        emailAddress: {
          type: String,
          trim: true,
        },
        telePhone: {
          type: String,
          required: true,
        },
        address1: {
          type: String,
          trim: true,
          required: true,
        },
        address2: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
          required: true,
        },
        district: {
          type: String,
          trim: true,
          required: true,
          default: "Dhaka",
        },
        postCode: {
          type: Number,
        },
      },
      paymentinfo: {
        paymentmethod: {
          type: String,
          required: true,
        },
        ispaid: {
          type: Boolean,
          default: false,
        },
      },
      status: {
        type: String,
        enum: ["pending", "processing", "deliverd", "cancel"],
        default: "pending",
        required: true,
        trim: true,
      },
      subTotal: {
        type: Number,
        default: 0,
      },
      totalQuantity: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  );
  

  module.exports = mongoose.model("order", orderSchema);