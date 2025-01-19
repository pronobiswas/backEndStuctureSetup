const express = require("express");
const {
  addToCartControler,
  romoveCartControler,
  incrementCartControler,
  decrementCartControler,
  userCartItem,
} = require("../../Controler/userCart.Controler");
const { authGuard } = require("../../middlewere/authguard");

const _ = express.Router();

_.route("/addtocart").post(authGuard, addToCartControler);
_.route("/deleteCartItem/:id").post(authGuard, romoveCartControler);
_.route("/incrementCartItem/:id").post(authGuard, incrementCartControler);
_.route("/decrementCartItem/:id").post(authGuard, decrementCartControler);
_.route("/uesrCart").get(authGuard, userCartItem);

module.exports = _;
