const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");




//Index Route
router.get("/",wrapAsync( async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}))

//New Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new");
})

//Show Route
router.get("/:id",wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id).populate({path:"reviews",populate:{ path:"author"}}).populate("owner")
  console.log(listing);
  if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/login");
  }
  res.render("listings/show", { listing });
}))


//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync( async (req, res) => {
  let result=listingSchema.validate(req.body);
   let newListing = new Listing(req.body.listing);
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","Successfully made a new listing");
   res.redirect("/listings");
  
}))
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  const listing= await Listing.findById(id);
    if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
  }
  res.render("listings/edit",{listing});
}))
//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
  let id=req.params.id;

  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Successfully updated the listing");
  res.redirect('/listings/'+id);
}))

//Delete Route for Listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let id=req.params.id;
  let deletedListing= await Listing.findByIdAndDelete(id);
  req.flash("success","Successfully deleted the listing");
  res.redirect("/listings");
}))

module.exports = router;