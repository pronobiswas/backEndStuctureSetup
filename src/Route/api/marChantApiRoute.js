const express = require('express');
const { createMarchantControler, getAllMarchantControler, UpdateMarchantControler, getSingleMarchatControler, } = require('../../Controler/marchant.Controler');
const _ = express.Router();

_.route('/createMarchant').post(createMarchantControler);
_.route('/getAllMarchant').get(getAllMarchantControler);
_.route('/UpdateMarchant/:id').patch(UpdateMarchantControler);
_.route('/getSingleMarchat/:id').get(getSingleMarchatControler);

module.exports = _;