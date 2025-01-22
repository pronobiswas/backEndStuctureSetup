const express = require("express");
const { palceOrder } = require("../../Controler/orderControler");
const { authGuard } = require("../../middlewere/authguard");
const _ = express.Router();

_.route('/palceOrder').post( authGuard,palceOrder);

module.exports = _;