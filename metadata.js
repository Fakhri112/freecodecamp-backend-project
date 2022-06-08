const express = require('express');
const multer = require('multer');
const cors = require("cors")
require('dotenv').config()
const upload = multer({ dest: 'uploads/' })
const port = 4030

const app = express();


app.use(cors());
// in order to pass the test, this html form must be included
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

//main endpoint
app.post('/api/fileanalyse',upload.single('upfile'), (req,res)=>{
    const file = req.file
    console.log(file)
    res.json({
        name: file.originalname,
        type: file.mimetype,
        size: file.size
    })

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})