const express = require('express');
const {upload} = require('../../middlewere/multer.middlewere')
const { postProductControler } = require('../../Controler/product.Controler');
const _ = express.Router();
_.route('/postProduct').post(upload.fields([{ name: 'image', maxCount: 10 }]),postProductControler)

module.exports = _;