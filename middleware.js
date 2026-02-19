const Listing=require("./models/listing");
const Review=require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;

        req.flash("error","You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}
//This middleware checks if the user is authenticated using Passport's req.isAuthenticated() method.
//  If the user is not authenticated, it saves the original URL they were trying to access in the session (so we can redirect them back after login),
//  flashes an error message, and redirects them to the login page. 
// If the user is authenticated, it simply calls next() to proceed to the next middleware or route handler.
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
  //Check if user owns listing
      if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
//Validation Middleware
module.exports.validateListing = (req, res, next) => {
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

//Validation Middleware
module.exports.validateReview = (req, res, next) => {
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {reviewId,id}=req.params;
    let review= await Review.findById(reviewId);
  //Check if user owns listing
      if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error","You are not authorized to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
}