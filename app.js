const express = require("express");
const app = express();
const ExpressError = require("./utils/ExpressErrors.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); //for overriding the request
const ejsMate = require("ejs-mate"); //using ejs-mate as a engine for ejs.(better for boilerplatting)
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =  require("./models/users.js")

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); //for parsing the requesting
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //have made boiler plate inside layouts folder (Please! read documentation of ejs mate)
//and made footer and navbar in the includes folder
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

const sessionOptions = {
    secret: "mysupersecretstring", 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7, //expires after one week
        maxAge: 1000*60*60*24*3,
        httpOnly: true, // for stoping cross scripting attacks
    },
};

app.get("/", (req, res) => {
    res.send("hii, i am root");
});

app.use(session(sessionOptions));
app.use(flash()); //flash must be declrared before the router 
// for authenitcation
app.use(passport.initialize()); // middlware that initializes the passport
app.use(passport.session()); // it finds - same user is sending req or diff one is sending
passport.use(new LocalStrategy(User.authenticate())); // authenticate method does the authentication through LocalStrategy method
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req,res, next)=> {
    next(new ExpressError(404, "Page not found"));
});                                                        

app.use ((err, req, res, next)=> {     
    let {statusCode=500, message="something went wrong!"} = err; 
    res.status(statusCode).render("error.ejs", {message});
});
            
app.listen(8080, (s) => { 
    console.log("server is listing on port 8080")
});      