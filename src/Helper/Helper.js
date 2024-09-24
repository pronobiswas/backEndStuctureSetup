const bcrypt = require("bcrypt");
const bcryptPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password , 10);
        return hashPassword
    } catch (error) {
        console.log(error);
    }
}; 
module.exports = {bcryptPassword}
