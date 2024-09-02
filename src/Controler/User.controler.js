const CreateUser = async(req,res)=>{
    try {
        res.send("everything is ok")
    } catch (error) {
        console.log(`this is create user Error ${error}`);
    }
}

module.exports = {CreateUser}