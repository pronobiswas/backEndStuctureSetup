const express = require('express');
const { CreateBannerControl, GetallBannerImageControler } = require('../../Controler/bannerControler');
const { upload } = require('../../middlewere/multer.middlewere');
const _ = express.Router();

_.route('/banner').post(upload.fields([{ name: 'image', maxCount: 1 }]),CreateBannerControl).get(GetallBannerImageControler);



module.exports = _;