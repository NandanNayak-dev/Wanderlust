const Listing = require("../models/listing");


//Index
module.exports.index=async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}
//New
module.exports.renderNewForm= (req, res) => {
  res.render("listings/new");
}
//Show
module.exports.showListing=async (req, res) => {
  let listing = await Listing.findById(req.params.id).populate({path:"reviews",populate:{ path:"author"}}).populate("owner")
  console.log(listing);
  if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/login");
  }
  res.render("listings/show", { listing });
}
//Create
module.exports.createListing=async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,"..",filename)
   let newListing = new Listing(req.body.listing);
   newListing.owner=req.user._id;
   newListing.image.url=url;
   newListing.image.filename=filename;
   await newListing.save();
   req.flash("success","Successfully made a new listing");
   res.redirect("/listings");
  
}
//Edit
module.exports.renderEditForm=async(req,res)=>{
  let id=req.params.id;
  const listing= await Listing.findById(id);
    if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
  }
  res.render("listings/edit",{listing});
}
//Update
module.exports.updateListing=async(req,res)=>{
  let id=req.params.id;
  

  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!=='undefined' ){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image.url=url;
    listing.image.filename=filename;

  await listing.save();
  }

  req.flash("success","Successfully updated the listing");
  res.redirect('/listings/'+id);
}
//Delete
module.exports.destroyListing=async(req,res)=>{
  let id=req.params.id;
  let deletedListing= await Listing.findByIdAndDelete(id);
  req.flash("success","Successfully deleted the listing");
  res.redirect("/listings");
}
