const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userScheme=mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
pic:{
    type:String,
    default:"https://res.cloudinary.com/madhu123/image/upload/v1609743474/noimage_daox8f.png"
},
followers:[{
    type:ObjectId,
    ref:"User"
}],
following:[{
    type:ObjectId,
    ref:"User"
}]
});
mongoose.model("User",userScheme)