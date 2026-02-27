const express = require("express");
const router = express.Router({});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
const user = require("../models/user.js");
//------------------Signup and login routes------------------
//Signup route
router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));

//Login route
router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

//Logout route
router.get("/logout",userController.Logout);
module.exports = router;
