const express = require('express')
//console.log(express)
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./database/connectDb')
const fileUpload = require("express-fileupload");




//image upload
app.use(fileUpload({useTempFiles : true}))

// view ejs set
app.set('view engine', 'ejs')
//css image js link public
app.use(express.static('public'))
//connectDb
connectDb()
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))

//connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
//messages
app.use(session({
  secret: 'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized: false,
}));

//flash messages
app.use(flash());





//route load
app.use('/', web)
//servercreate
app.listen(port, () => {
    console.log(`server start localhost: ${port}`)
  })