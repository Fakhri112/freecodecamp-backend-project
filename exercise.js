
const express = require('express');
const bodyParser = require("body-parser");
const { exercise } = require("./model/db");
const cors = require('cors')
const app = express()
const port = 4030;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());

//save username
app.post('/api/users', async (req,res)=>{
    const input_username = new exercise({
        username: req.body.username,
        count: 0,
    })
    await input_username.save().then(resp=>{
        res.json({
            _id: resp._id, 
            username: resp.username,
            count: resp.count,
            log: resp.log
        })
    })
})

//save user exercise
app.post('/api/users/:_id/exercises', async(req, res)=>{
    const exerciseData = {
        description: req.body.description,
        duration: req.body.duration,
    }

    if (req.body.date !== ""){
        exerciseData.date = new Date(req.body.date).toDateString()
    }
    if(req.body.date == undefined){
        exerciseData.date = new Date().toDateString()
    }

    const getUser = await exercise.findById(req.params._id)
    getUser.count = getUser.count+1
    getUser.log.push(exerciseData)

    const responData = {
            _id:req.params._id,
            username: getUser.username,
            date: new Date(exerciseData.date).toDateString(),
            duration: parseInt(exerciseData.duration),
            description: exerciseData.description
        }

    await getUser.save()
    res.json(responData)
})

//get all users
app.get('/api/users', async(req, res)=>{
    const findAllData = await exercise.find().select("-log -count")
    res.send(findAllData)
})

//get specific user logs
app.get('/api/users/:_id/logs', async(req, res)=>{
    const findUser = await exercise.findById(req.params._id).select('-__v')
    const limit = req.query.limit
    const responseData = {
        _id: req.params._id,
        username: findUser.username,
        count: findUser.count
    }

    // check query parameter of 'from' and 'to'
    for (i=0; i<findUser.log.length; i++){
        const currentDate = new Date(findUser.log[i].date)
        if (req.query.from != undefined){
            const from = new Date(req.query.from)
            responseData.from = from.toDateString()
            if (from>currentDate){
                findUser.log.splice(i,1)
                findUser.count -= 1
                i--
            }
        }
        if (req.query.to != undefined){
            const to = new Date(req.query.to).toDateString()
            responseData.to = to
            if (to<currentDate){
                findUser.log.splice(i,1)
                findUser.count -= 1
                i--
            }
        }
    }
    responseData.log = findUser.log

    // check query of 'limit'
    if (limit != undefined){
    responseData.log.length = limit
    responseData.count = limit
    }

    console.log(responseData)
    res.json(responseData)
})




  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})