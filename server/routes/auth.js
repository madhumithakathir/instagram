const express=require('express')
const router= express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin=require('../middleware/requiredLogin')
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
// const transporter=nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_keys:"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"
//     }
// }))


//protected
router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

//signup
router.post('/signup',(req,res)=>{
const {name,email,password,pic}=req.body
if( !name||!email || !password ){
   return res.status(422).json({error:"please add all the fiels"})
}
User.findOne({email:email})
.then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"user already exists"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user=new User({
            name,
            email,
            password:hashedpassword,
            pic
            
        })
        user.save().then(user=>{
            // transporter.sendMail(
            //     {
            //         to:user.email,
            //         from:"no-reply@insta.com",
            //         subject:"Signup Successfully",
            //         html:"<h1>Welcome To Instagram</h1>"
            //     }
            // )
            res.json({message:"saved successfully"})
        })
        .catch(err =>{
            console.log(err)
        })        
    })
    
})
.catch(err =>{
    console.log(err)
})
})

//signin
router.post('/signin',(req,res)=>{
const {email,password}=req.body
if(!email || !password){
    res.status(422).json({error:"please add email or password"})
}
User.findOne({email:email})
.then(savedUser=>{
    if(!savedUser){
        res.status(422).json({error:"Invalid email or password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
           // res.json({message:" signed in"})
           const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
           const {_id,name,email,followers,following,pic}=savedUser
           res.json({token,user:{_id,name,email,followers,following,pic}})
        }
        else{
            return res.status(422).json({error:"Invalid email or password"})
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

})
 module.exports=router