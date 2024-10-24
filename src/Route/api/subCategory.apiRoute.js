const express = require('express');
const { createSubCategoryControler, deleteSubCategoryControler, getAllSubCategoryControler, getSingleCategoryControler } = require('../../Controler/subCategory.Controler');
const _ = express.Router();

_.route("/createSubCategory").post(createSubCategoryControler);
_.route("/allSubCategory").get(getAllSubCategoryControler);
_.route("/singleSubCategory/:id").get(getSingleCategoryControler);
_.route("/deleteSubCategory/:id").delete(deleteSubCategoryControler);

module.exports = _;