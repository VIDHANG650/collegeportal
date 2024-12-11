const express = require('express')
//console.log(express)
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./database/connectDb')


// view ejs set
app.set('view engine', 'ejs')
//css image js link public
app.use(express.static('public'))
//connectDb
connectDb()
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))







//route load
app.use('/', web)
//servercreate
app.listen(port, () => {
    console.log(`server start localhost: ${port}`)
  })