const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
const user = require("../models/user.js");
//------------------Signup and login routes------------------
//Signup route
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//Login route
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);



//Logout route
router.get("/logout",userController.Logout);
module.exports = router;
