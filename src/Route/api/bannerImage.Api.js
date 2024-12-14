const express = require('express');
const { CreateBannerControl, GetallBannerImageControler, updateBannnerControler } = require('../../Controler/bannerControler');
const { upload } = require('../../middlewere/multer.middlewere');
const _ = express.Router();

_.route('/banner').post(upload.fields([{ name: 'image', maxCount: 1 }]),CreateBannerControl).get(GetallBannerImageControler);
_.route('/banner/:id').put(upload.fields([{name:'image' , maxCount:1}]),updateBannnerControler);



module.exports = _;