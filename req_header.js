const express = require('express');
const app = express()
const port = 4030;

//main endpoint
app.get('/api/whoami', (req,res)=>{
    const ipaddress= req.ip
    const language = req.headers['accept-language']
    const software = req.headers['user-agent']
    res.json({ipaddress, language, software})

})



  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})