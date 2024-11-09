const express = require('express');
const {upload} = require('../../middlewere/multer.middlewere')
const { postProductControler, getAllProductControler, updatePrductControler } = require('../../Controler/product.Controler');
const _ = express.Router();

_.route('/postProduct').post(upload.fields([{ name: 'image', maxCount: 10 }]),postProductControler);
_.route("/allProduct").get(getAllProductControler);
_.route("/updateProduct/:id").patch(upload.fields([{ name: 'image', maxCount: 10 }]),updatePrductControler);

module.exports = _;