const express = require('express');
const {Router} = express;
const {ApiResponse} = require('../../Utils/ApiResponse.js')
const _  = Router();
const {CreateUser} = require('../../Controler/User.controler.js')

_.route("/regestetion").post(CreateUser)

module.exports = _