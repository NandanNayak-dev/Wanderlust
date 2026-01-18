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

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
//------------------MONGOOSE CONNECTION------------------------

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("connected to database")).catch((err) => console.log(err));
//-----------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


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
