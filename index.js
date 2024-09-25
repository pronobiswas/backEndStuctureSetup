require('dotenv').config()

 const {databaseConnection} = require('./src/DataBaseConfig/configureDatabase.js')
 const app = require('./src/app.js')

 databaseConnection()