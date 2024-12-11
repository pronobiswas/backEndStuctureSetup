var express = require('express')
const {Router} = express;
const _ = Router();
const authRoutes = require('./api/auth.ApiRoutes.js')
const categoryRoutes = require('./api/category.apiRoute.js');
const subCategoryRoutes = require('./api/subCategory.apiRoute.js');
const marchantRoute = require('./api/marChantApiRoute.js')
const productRoute = require('./api/product.ApiRoute.js')
const bannerRoute = require('./api/bannerImage.Api.js')
const bestSellingProductRoute = require('./api/bestSellingApi.Route.js')
const {ApiError} = require('../Utils/ApiError.js')


_.use(authRoutes);
_.use(categoryRoutes);
_.use(subCategoryRoutes);
_.use(marchantRoute);
_.use(productRoute);
_.use(bannerRoute);
_.use(bestSellingProductRoute);


_.use((req,res)=> {
    res.status(400).json(new ApiError(false, null, 404, "Api Routes InValid !!"))
  
} )
module.exports = _;