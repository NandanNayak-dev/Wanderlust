const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");


router.route("/")
//Contains index route and post route
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
//Contains show route, put route and delete route
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.renderEditForm));


module.exports = router;