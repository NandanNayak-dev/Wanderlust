const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => console.log("connected to database")).catch((err) => console.log(err));
//-----------------------------------------------------------------------------------
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


//Index Route
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
})

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
})
//Show Route
app.get("/listings/:id", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
})

//Create Route
app.post("/listings", async (req, res) => {
   let newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
  
})



