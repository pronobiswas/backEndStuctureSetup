const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema({
  title: {
    type: String,
    required: [true, "category  required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description  required"],
    trim: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: [true, "Catagory  required"],
  },
});
module.exports = mongoose.model("subcategory", subCategorySchema);
