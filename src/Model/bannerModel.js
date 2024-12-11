const mongoose = require('mongoose');
const {Schema , types} = mongoose;
const bannerSchema = new Schema ({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    image:{
        type:String ,
        required:true
    }
},{Timestamp:true})

module.exports = mongoose.model('banner' , bannerSchema);