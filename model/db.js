const mongoose = require('mongoose')
require('dotenv').config()
const mongoUri = process.env.MONGOURI

mongoose.connect(mongoUri).then((res)=>{
    console.log("Connected!")
}).catch((err)=> (console.log("There is problem during connection")));

// model for shorturl
const shortUrl = mongoose.model('shortUrl',{
    original_url:{
        type:String,
    },
    short_url:{
        type:Number
    }
})

// model for exercise
const exercise = mongoose.model('exercise',{
    username: String,
    count: Number,
    from: Date,
    to: Date,
    log: [{
        _id: false,
        description: String,
        duration: Number,
        date: String,
    }]
})

module.exports = {shortUrl, exercise}