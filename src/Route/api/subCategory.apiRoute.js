const express = require('express');
const { createSubCategoryControler, deleteSubCategoryControler, getAllSubCategoryControler } = require('../../Controler/subCategory.Controler');
const _ = express.Router();

_.route("/createSubCategory").post(createSubCategoryControler);
_.route("/allSubCategory").get(getAllSubCategoryControler);
_.route("/deleteSubCategory/:id").post(deleteSubCategoryControler);

module.exports = _;