const express = require('express');
const {Router} = express;
const {CreateUser} = require('../../Controler/User.controler.js')
const _  = Router();

_.route("/regestetion").post(CreateUser);
_.route("/").get((req,res)=>{
res.send('hello')
});

module.exports = _