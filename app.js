const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")))
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");
//------------------MONGOOSE CONNECTION------------------------

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("connected to database")).catch((err) => console.log(err));
//-----------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Validation Middleware
const validateListing = (req, res, next) => {
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}


//Index Route
app.get("/listings",wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}))

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
})
//Show Route
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  console.log(listing);
  res.render("listings/show", { listing });
}))

//Create Route
app.post("/listings",validateListing,wrapAsync( async (req, res) => {
  let result=listingSchema.validate(req.body);
   let newListing = new Listing(req.body.listing);
   await newListing.save();
   console.log(newListing);
   res.redirect("/listings");
  
}))
//Edit Route
app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  const listing= await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit",{listing});
}))
//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  console.log(req.body.listing);
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect('/listings/'+id);
}))
//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let id=req.params.id;
  let deletedListing= await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}))

//Error Handling Middleware
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