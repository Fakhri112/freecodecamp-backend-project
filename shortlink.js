const express = require('express');
const {shortUrl} = require('./model/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 4030;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

//middleware to check if http or https is included
const validation = (req, res, next) =>{
    const address = req.body.url
    try {
        new URL(address)    
        if (address.indexOf('http://') == 0 || address.indexOf('https://') == 0){
            return next()
        }
        return res.json({error: "Invalid URL"})
    } catch (error) {
        return res.json({error: "Invalid URL"})
    }   
}

// create shortlink
app.post('/api/shorturl',validation, async(req,res)=>{
    try{
        const data = {
        original_url: req.body.url,
        short_url: 1
    }

    const checkLink = await shortUrl.find({original_url: req.body.url})
    if(checkLink.length!==0){
        return res.json({
            original_url: checkLink[0].original_url,
            short_url: checkLink[0].short_url
        })
    }

    const latestShortUrl = await shortUrl.find().sort({_id: -1}).limit(1)
    if(latestShortUrl.length!==0){
        data.short_url += latestShortUrl[0].short_url
    }

    const input_data = new shortUrl(data)
    await input_data.save().then((resp)=>{
        res.json({
            original_url: resp.original_url,
            short_url: resp.short_url
        })
    })
  }
  catch (e){
    console.log(e)
  }
})

// redirect to original url
app.get('/api/shorturl/:id', async(req, res)=>{
    const idUrl = req.params.id
    const findUrl = await shortUrl.find({short_url: idUrl})
    res.status(301).redirect(findUrl[0].original_url)
})





  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})