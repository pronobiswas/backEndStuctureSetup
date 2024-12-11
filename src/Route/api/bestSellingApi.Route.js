const express = require("express");
const {
  CreateBestsellingControler,
} = require("../../Controler/bestSelling.Controler");
const _ = express.Router();

_.route("/bestSelling").post(CreateBestsellingControler);

module.exports = _;
