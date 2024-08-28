const mongoose = require('mongoose');
const chalk = require('chalk');
const {DB} = require('../Constant/constant.js')

const databaseConnection =async ()=>{
    
try {
    const connectionInfo = await mongoose.connect(`${process.env.DATABASE_URL}/${DB}`)
    console.log(chalk.bgGreen(connectionInfo.connection.host));
    
} catch (error) {
    console.log(chalk.bgRedBright(error)); 
}

}
module.exports = {databaseConnection}