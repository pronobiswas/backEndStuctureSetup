const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product Name Missing"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product Name Missing"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "subcategory",
    },
    price: {
      type: String,
      trim: true,
      required: [true, "Product price is Required"],
    },
    discountPrice: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    review: [
      {
        type: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    storeid: {
      type: Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
