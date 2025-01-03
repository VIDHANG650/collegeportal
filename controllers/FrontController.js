const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require('jsonwebtoken');

//setup
cloudinary.config({
  cloud_name: "dqjtns61m",
  api_key: "929355454251114",
  api_secret: "NxP6wHotJnyps5HtPtAnoogMNH8",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const{name,image,email} = req.udata
      res.render("home", {n:name,i:image, e:email});
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const{name,image} = req.udata
      res.render("about",{n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
  
    try {
      const{name,image} = req.udata
      res.render("contact",{n:name,i:image});
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", { msg: req.flash("success"),
        msg1:req.flash('success'),
        msg1:req.flash('error')
       });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  //userinsert
  static userinsert = async (req, res) => {
    try {
      // console.log(req.body)
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        req.flash("error", "All fields are required.");
        return res.redirect("/register");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");
        return res.redirect("/register");
      }
      if (password != confirmpassword) {
        req.flash("error", "Password does not match.");
        return res.redirect("/register");
      }
      //image upload
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      //console.log(imageUpload)

      const hashpassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image:{
            public_id:imageUpload.public_id,
            url:imageUpload.secure_url
        }
      });
      req.flash("success", "Register Successfully ! Please login here");
      res.redirect("/"); // route web
    } catch (error) {
      console.log(error);
    }
  };
  //verify login
  static verifyLogin = async (req,res) =>{
    try{
      //console.log(req.body)
      const{email,password} = req.body

      const user = await UserModel.findOne({email});
      //console.log(user)
      if(!user){
        req.flash("error", " You are not register User");
        return res.redirect("/")
      }else{
        const isMatch = await bcrypt.compare(password,user.password)
        // console.log(isMatch)
        if(isMatch){
          //token

          const token = jwt.sign({ ID: user.id}, 'fgjhftyftucvkh254');
          //console.log(token)
          res.cookie('token', token)

          return res.redirect('/home')
        }else{
          req.flash("error", "email or password doesn't match");
          return res.redirect("/")
        }
      }

    }catch(error){
      console.log(error)
    }
  }
  //logout
  static logout = async (req,res) =>{
    try{
      res.clearCookie("token"); //clearCookie----> token ko expire krega
      res.redirect('/')
    }catch(error){
      console.log(error)
    }
  }
  

}
module.exports = FrontController;
