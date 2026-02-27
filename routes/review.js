const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



//Review Route
//POST
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));


//Delete Review Route
//pull
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;