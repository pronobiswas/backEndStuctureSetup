const express = require('express');
const {createCategoryControler, getallCategoryControler, getSingleCategoryControler, approveCategoryControler} = require('../../Controler/category.controler');
const _ = express.Router();
_.route('/category').post(createCategoryControler);
_.route('/allCategory').get(getallCategoryControler);
_.route('/getAsingleCategory/:id').get(getSingleCategoryControler);
_.route('/approveCategory').post(approveCategoryControler);

module.exports = _;