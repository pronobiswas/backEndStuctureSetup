var express = require('express')
const {Router} = express;
const _ = Router();
const authRoutes = require('./api/auth.ApiRoutes.js')
const {ApiError} = require('../Utils/ApiError.js')


_.use(authRoutes);

_.use((req,res)=> {
    res.status(400).json(new ApiError(false, null, 404, "Api Routes InValid !!"))
  
} )
module.exports = _;