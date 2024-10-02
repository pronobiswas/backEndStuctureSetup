const express = require('express')
const chalk = require('chalk')
const app = express();
const allRoutes = require('./Route/index.js');
const cors = require('cors')
const cookieParser = require('cookie-parser')

// all middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(allRoutes);
app.use(cookieParser());


app.listen(process.env.PORT || 3000, ()=> {
    console.log(chalk.bgCyanBright(`Server Connected on Port http://localhost:${process.env.PORT}`));
})