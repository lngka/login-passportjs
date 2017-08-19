"use strict";
const express       = require("express");
const router        = express.Router();
const passport      = require("passport");
const passportConfig = require("../config/passportConfig.js");

// some DB functions
const createUser = require("../common/createUser.js");
const isLoggedIn = require("../common/isLoggedIn.js");

router.get("/register", function(req, res) {
    res.render("register");
});

router.get("/login", function(req, res) {
    if (isLoggedIn(req, res)) {
        req.flash("success_msg", "But you are already logged in!");
        res.render("index");
    }
    res.render("login");
});

router.post("/register", function(req, res) {
    var userName = req.body.userName;
    var email = req.body.email;
    var password = req.body.password;

    // server-side form validation using "express-validator"
    // only for education purpose, cuz client side validation via HTML5
    req.checkBody("userName", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is not valid").isEmail();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password2", "Passwords do not match").equals(req.body.password);

    var validationErrors = req.validationErrors();
    if (validationErrors) {
        res.render("register", {"errors": validationErrors});
    } else {
        createUser(userName, password, email, function(err) {
            if (err) {
                req.flash("error_msg", err.message);
                res.redirect("/users/register");
            } else {
                req.flash("success_msg", "You are registered!");
                res.redirect("/users/login");
            }
        });
    }
});

passportConfig(passport);
router.post("/login", passport.authenticate("local", {
    "successRedirect": "/",
    "failureRedirect": "/users/login",
    "failureFlash": true
}));

router.get("/logout", function(req, res){
    console.log(req.user);
    console.log(req.session);
    console.log(res.locals);
    req.logout();
    req.flash("success_msg", "Securely logged out");
    res.redirect("/");
});

module.exports = router;
