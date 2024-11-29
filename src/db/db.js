require('dotenv').config({path:"./.env"})
// require('../utils/Twilio')
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL).then((res)=>{
    console.log("Database Connected")
},(fail)=>{
    
        mongoose.connect(process.env.LOCAL_DB).then((done)=>{
            console.log("Local data base connected")
        },(failed)=>{
            console.log('Local databse also not connected')
        })
   
})
