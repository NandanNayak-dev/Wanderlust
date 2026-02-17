const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")))

const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
//------------------MONGOOSE CONNECTION------------------------

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("connected to database")).catch((err) => console.log(err));
//-----------------------------------------------------------------------------------

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student1@gmail.com",
    username:"delta-student1"
  });
   let registeredUser= await User.register(fakeUser,"helloworld1");
   console.log(registeredUser);
   res.send(registeredUser);
})

///////////////////////////////////////////////
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
//////////////////////////////////////////////////



//Error Handling Middleware--------------------------
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("error",{message});
  
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});