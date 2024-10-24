const express = require('express');
const { createSubCategory } = require('../../Controler/subCategory.Controler');
const _ = express.Router();

_.route("/createSubCategory").post(createSubCategory);

module.exports = _;