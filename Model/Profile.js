const mongoose =require('mongoose');
const schema=mongoose.Schema;
const profileschema= new schema({
    photo:{
        type:[]
    },
    name:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    education:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.export = mongoose.model('profile',profileschema)