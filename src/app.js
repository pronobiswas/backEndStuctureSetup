const express = require('express')
const chalk = require('chalk')
const app = express();
const allRoutes = require('./Route/index.js');

app.use(allRoutes);

app.get('/', function (req, res) {
  res.send('Hello World ')
  console.log(process.env.PORT);
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(chalk.bgCyanBright(`Server Connected on Port http://localhost:${process.env.PORT}`));
})