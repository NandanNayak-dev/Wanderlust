const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");




//Review Route
//POST
router.post("/",validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  // console.log("newReview-->",newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","Successfully added a new review");
  res.redirect(`/listings/${listing._id}`);
}))


//Delete Review Route
//pull
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Successfully deleted the review");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;