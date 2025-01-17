const express = require("express");
const { addToCartControler } = require("../../Controler/userCart.Controler");
const { authGuard } = require("../../middlewere/authguard");

const _ = express.Router();

_.route("/addtocart").post(authGuard,addToCartControler);

module.exports = _;
