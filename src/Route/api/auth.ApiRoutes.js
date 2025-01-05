const express = require("express");
const { Router } = express;
const {
  CreateUser,
  loginCrontroller,
  getAllRegisterUser,
  otpMatchControler,
  forgotPasswordControler,
  restPasswordControler,
  roleChangeControler,
} = require("../../Controler/User.controler.js");
const { authGuard } = require("../../middlewere/authguard.js");
const _ = Router();

_.route("/").get((req, res) => {
  res.send("hello");
  authGuard();
});
_.route("/regestetion").post(CreateUser);
_.route("/login").post(loginCrontroller);
_.route("/otp").post(otpMatchControler);
_.route("/forgotpassword").post(forgotPasswordControler);
_.route("/resetPassword").post(restPasswordControler);
_.route("/changerole").post(roleChangeControler);
_.route("/allUsers").get(getAllRegisterUser);

module.exports = _;
