const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "frist mane missing"],
      trim: true,
      max: [15, "Max Name Size 25 Character "],
      min: [3, "Min Value 3 character"],
    },
    lastName: {
      type: String,
      trim: true,
      min: [3, "Min Value 3 character"],
      max: [15, "Max Name Size 25 Character "],
    },
    emailAddress: {
      type: String,
      required: [true, "emailAddress is missing"],
      trim: true,
      unique: true,
    },
    telePhone: {
      type: String,
      required: [true, "telephone is missing"],
      trim: true,
      unique: true,
    },
    address1: {
      type: String,
      // required: [true, "address1 is missing"],
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    postCode: {
      type: String,
      trim: true,
      max: 4,
    },
    devision: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Passsword is missing"],
      trim: true,
    },
    otp: {
      type: String,
    },
    userIsVeryFied: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "marchent"],
      default: "user",
    },
    token: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", UserSchema);
module.exports = { userModel };
