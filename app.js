const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("../15_major Project/models/listings.js");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

main()
    .then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.get("/", (req, res) => {
    res.send("hii, i am root");
});

// app.get("/listingtest", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Jannat",
//         description: "in the Kachra depo",
//         prince: 1200,
//         location: "Kothrud",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("data saved successfully");
//     res.send("Data saved");
// })

app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", {allListings});
});
  
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/show.ejs", {listings});
});

//create route
app.post("/listings", async (req, res) => {
    const newlisting = new Listing(req.body.Listing);
    await newlisting.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edit.ejs", {listings})
});

//update route
app.put("/listings/:id", async (req, res) => {
    let {id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


app.listen(8080, (s) => {
    console.log("server is listing on port 8080")
});  