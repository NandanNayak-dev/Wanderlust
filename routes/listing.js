const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");

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
router.get("/",wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}))

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new");
})
//Show Route
router.get("/:id",wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id).populate("reviews");
  console.log(listing);
  res.render("listings/show", { listing });
}))


//Create Route
router.post("/",validateListing,wrapAsync( async (req, res) => {
  let result=listingSchema.validate(req.body);
   let newListing = new Listing(req.body.listing);
   await newListing.save();
   req.flash("success","Successfully made a new listing");
   res.redirect("/listings");
  
}))
//Edit Route
router.get("/:id/edit",validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  const listing= await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit",{listing});
}))
//Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  console.log(req.body.listing);
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect('/listings/'+id);
}))

//Delete Route for Listing
router.delete("/:id",wrapAsync(async(req,res)=>{
  let id=req.params.id;
  let deletedListing= await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}))

module.exports = router;