console.log("joy horibol");
 const {databaseConnection} = require('./src/DataBaseConfig/configureDatabase.js')
 const app = require('./src/app.js')
 require('dotenv').config()

 databaseConnection()