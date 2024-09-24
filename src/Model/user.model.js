const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: [true, "frist mane missing"],
      trim: true,
      max: [15, "Max Name Size 25 Character "],
      min: [3, "Min Value 3 character"],
    },
    LastNane: {
      type: String,
      trim: true,
      min: [3, "Min Value 3 character"],
      max: [15, "Max Name Size 25 Character "],
    },
    EmailAddress: {
      type: String,
      required: [true, "emailAddress is missing"],
      trim: true,
      unique: true,
    },
    TelePhone: {
      type: String,
      required: [true, "telephone is missing"],
      trim: true,
      unique: true,
    },
    Address1: {
      type: String,
      required: [true, "address1 is missing"],
      trim: true,
    },
    Address2: {
      type: String,
      trim: true,
    },
    City: {
      type: String,
      trim: true,
    },
    PostCode: {
      type: String,
      trim: true,
      max: 4,
    },
    Devision: {
      type: String,
      trim: true,
    },
    District: {
      type: String,
      trim: true,
    },
    Password: {
      type: String,
      required: [true, "Passsword is missing"],
      trim: true,
    },
    OTP: {
      type: String,
    },
    Role: {
      type: String,
      enum: ["admin", "user", "marchent"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified(this.Password)) {
    this.Password = await bcrypt.hash(this.Password, 10);
    next();
  }
  next()
});
UserSchema.methods.isValidatePassword = async (plainPassword)=>{
  bcrypt.compare(plainPassword, this.Password)
}

const userModel = mongoose.model("user", UserSchema);
module.exports = { userModel };
