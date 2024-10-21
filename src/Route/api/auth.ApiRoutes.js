const express = require("express");
const { Router } = express;
const { CreateUser ,loginCrontroller ,getAllRegisterUser, otpMatchControler, forgotPasswordControler} = require("../../Controler/User.controler.js");
const { ReturnDocument } = require("mongodb");
const _ = Router();

_.route("/").get((req, res) => {
  res.send("hello");
});
_.route("/regestetion").post(CreateUser);
_.route("/login").post(loginCrontroller);
_.route("/allUsers").get(getAllRegisterUser);
_.route("/otp").post(otpMatchControler);
_.route("/forgotPassword").post(forgotPasswordControler);

module.exports = _;
