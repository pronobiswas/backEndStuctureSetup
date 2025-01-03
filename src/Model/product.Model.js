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
      type: Number,
      trim: true,
      required: [true, "Product price is Required"],
    },
    discountPercent: {
      type: Number,
      trim: true,
    },
    rating: {
      type: Number,
      default: 3.5,
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
    isAproved: {
      type: String,
      enum: ['pending', 'approved', 'reject'],
      default: "pending",
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
