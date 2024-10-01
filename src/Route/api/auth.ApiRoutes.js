const express = require("express");
const { Router } = express;
const { CreateUser ,loginCrontroller } = require("../../Controler/User.controler.js");
const { ReturnDocument } = require("mongodb");
const _ = Router();

_.route("/").get((req, res) => {
  res.send("hello");
});
_.route("/regestetion").post(CreateUser);
_.route("/login").post(loginCrontroller);

module.exports = _;
