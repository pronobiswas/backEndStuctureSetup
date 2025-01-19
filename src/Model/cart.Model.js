const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;
const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { Timestamp: true }
);

module.exports = mongoose.model("userCart", cartSchema);
