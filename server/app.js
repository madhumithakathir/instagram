
require('./models/user')
require('./models/post')
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const PORT=8000
const {MONGOURI}= require('./keys')
const cors=require('cors')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    

})
mongoose.set('useFindAndModify', false)

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error',()=>{
    console.log("Error")
})
app.use(cors());
app.options('*',cors());
app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))






app.listen(PORT,()=>{
    console.log("server is running",PORT)
});