const express = require("express");
const router = express.Router(); 
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup",wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next();
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
}));

router.get("/login",
    async (req, res) => 
    {
        res.render("users/login.ejs");
    }
);

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: '/login', failureFlash: true }), 
    async(req, res) => 
    {
        req.flash("success","Welcome back!, You are Logged In.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logOut((err)=> {
        if(err) {
            return next();
        }
        req.flash("success", "You are logged Out Now!");
        res.redirect("/listings");
    });
});
module.exports = router;