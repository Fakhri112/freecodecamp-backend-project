
const express = require('express');
const app = express()
const port = 4030;

app.get('/api/:date', (req, res) => {
    const dateParam = req.params.date
    if (!isNaN(dateParam)){
        //unix parameter
        const unix = parseInt(dateParam)
        const utc = new Date(unix).toUTCString()
        return res.json({unix, utc})
    }
    //utc parameter
    const utcDate  = new Date(dateParam)
    if (utcDate == "Invalid Date"){
        return res.json({error: "Invalid Date"})
    }
    const unix = utcDate.getTime()
    const utc = utcDate.toUTCString()
    return res.json({unix, utc})
  })

app.get('/api', (req,res)=>{
    //default date
    const utc = new Date().toUTCString()
    const unix = new Date().getTime()
    res.json({unix, utc})

})



  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})