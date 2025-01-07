const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressErrors.js");
const Listing = require("../models/listings.js");
const session = require("express-session");
const flash = require("connect-flash");
const review = require("../models/review.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

//index route
router.get("/",wrapAsync( async(req,res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", {allListings});
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    if (!listings) {
        req.flash("error", "Listing does not exits!!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listings});
}));

//to be added - server side validation 

//create route
router.post(
    "/",
    validateListing ,
    wrapAsync(async(req, res, next) => {
        //lots of uppercase and lowercase gadabad i have done here. 
        const newlisting = new Listing(req.body.Listing); //we could do normally by parsing the respose like other routes, but we can make objecy key in the form named as 'Listing' in the form
        await newlisting.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");  
    })
);
  
//edit route
router.get("/:id/edit",
    wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing does not exits!!");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {listings})
}));
 
//update route
router.put(
    "/:id",
    validateListing, //first create the schema, then make function out of it, then pass as a middleware
    wrapAsync( async (req, res) => {
        let {id } = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.Listing});
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    })
);

//delete route
router.delete("/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;