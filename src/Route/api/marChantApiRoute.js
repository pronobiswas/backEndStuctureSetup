const express = require('express');
const { createMarchantControler } = require('../../Controler/marchant.Controler');
const _ = express.Router();

_.route('/marchant').post(createMarchantControler)

module.exports = _;