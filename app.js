const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("../15_major Project/models/listings.js");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true})); //for parsing the requesting

const methodOverride = require("method-override"); //for overriding the request
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate"); //using ejs-mate as a engine for ejs.(better for boilerplatting)
app.engine("ejs", ejsMate); //have made boiler plate inside layouts folder (Please! read documentation of ejs mate)
//and made footer and navbar in the includes folder

app.use(express.static(path.join(__dirname, "/public")));

const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/ExpressErrors.js");

const { listingSchema } = require("../15_major Project/schema.js");

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

app.get("/listings",wrapAsync( async(req,res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", {allListings});
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/show.ejs", {listings});
}));

//to be added - server side validation - as someone can test the things on the postman or hopscoch.io (e.g. Price)

//create route
app.post(
    "/listings",
    validateListing ,
    wrapAsync(async(req, res, next) => {
        //lots of uppercase and lowercase gadabad i have done here. 
        const newlisting = new Listing(req.body.Listing); //we could do normally by parsing the respose like other routes, but we can make objecy key in the form named as 'Listing' in the form
        await newlisting.save();
        res.redirect("/listings");  
    })
);
  
//edit route
app.get("/listings/:id/edit",
    wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edit.ejs", {listings})
}));
 
//update route
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync( async (req, res) => {
        let {id } = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.Listing});
        res.redirect(`/listings/${id}`);
    })
);


//delete route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
  
app.all("*", (req,res, next)=> {
    next(new ExpressError(404, "Page not found"));
});                                                        

app.use ((err, req, res, next)=> {
    let {statusCode=500, message="something went wrong!"} = err; 
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});
         
app.listen(8080, (s) => { 
    console.log("server is listing on port 8080")
});      