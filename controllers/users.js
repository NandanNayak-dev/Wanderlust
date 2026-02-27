const User=require("../models/user.js");

module.exports.renderSignupForm =(req,res)=>{
  res.render("users/signup");
} 
//Signup
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password)
    console.log(registeredUser);
    //After successful registration, we log the user in using req.login, which is a Passport method that establishes a login session.
    // If there's an error during login, we pass it to the next middleware. 
    // If login is successful, we flash a success message and redirect the user to the listings page.
    //Automatic login after registration
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//Login
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login");
}
//Login
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    console.log(res.locals.redirectUrl);
    // After successful login, we check if there's a redirect URL saved in res.locals.redirectUrl (which was set by the saveRedirectUrl middleware).
    res.redirect(res.locals.redirectUrl || "/listings");
}
//Logout
module.exports.Logout=(req,res,next)=>{
   req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","You have been logged out");
    res.redirect("/listings");
   })
}