const express = require("express");
const { addFlashSaleProductsControler, getFlashSaleProductsControler } = require("../../Controler/flashSaleControler");
const _ = express.Router();

_.route('/flashSale').get(getFlashSaleProductsControler);
_.route('/addFlashSale').post(addFlashSaleProductsControler);

module.exports =_;