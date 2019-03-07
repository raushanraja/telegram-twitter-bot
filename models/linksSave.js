const mongoose=require("mongoose")

const linkScheme =new mongoose.Schema({
    linkName:{
        type:String,
        required:true,
    },
    linkURL:{
        type:String,
        required:true,
        unique:true
    },
    linkCategory:Array,
})


module.exports = mongoose.model("Links",linkScheme);