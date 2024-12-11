const express = require('express')
const FrontController = require('../controllers/FrontController')
const route = express.Router()


//route
route.get('/home',FrontController.home)
route.get('/about',FrontController.about)
route.get('/contact',FrontController.contact)
route.get('/',FrontController.login)
route.get('/register',FrontController.register)

//insertdata
route.post('/userinsert',FrontController.userinsert)
  
  module.exports = route