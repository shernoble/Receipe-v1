// Category- model reference name

const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:'This field is required'
    },
    image:{
        type:String,
        required:'This field is required'
    }
});
// model name =categorys of schema categorySchema
module.exports=mongoose.model('Category',categorySchema);