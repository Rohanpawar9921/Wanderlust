const express = require("express");
const router = express.Router({mergeParams: true}); //the listing(parent route) objectId dont come, so we have to merge both
const wrapAsync = require("../utils/wrapAsync.js");
const {  reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressErrors.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

// review - post rout
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`)
}));

// review - delete route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //deleting the refernce of deleted review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
   