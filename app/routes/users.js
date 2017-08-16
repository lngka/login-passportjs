"use strict";
const express       = require("express");
const router        = express.Router();
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// some DB functions
const createUser    = require("../common/createUser.js");
const getUserByUsername = require("../common/getUserByUsername.js");
const checkCorrectPassword = require("../common/checkCorrectPassword.js");

router.get("/register", function(req, res) {
    res.render("register");
});

router.get("/login", function(req, res) {
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

passport.use(new LocalStrategy(
    function(username, password, done) {
        // User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) {
        //         return done(null, false, { message: "Incorrect username." });
        //     }
        //     if (!user.validPassword(password)) {
        //         return done(null, false, { message: "Incorrect password." });
        //     }
        //     return done(null, user);
        // });
        getUserByUsername(username, function(err, user) {
            if (err) { return done(err); }

            if (!user) {
                return done(null, false, { message: "Incorrect username."});
            }

            var hashedPassword = user.password;
            var submittedPassword = password;
            checkCorrectPassword(submittedPassword, hashedPassword, function(err, isCorrect) {
                if (err) { return done(err); }

                if (isCorrect) { return done(null, user);}
                else { return done(null, false, {"message": "Incorrect password."}); }
            });
        });
    }
));
router.post("/login", passport.authenticate("local", {
    "successRedirect": "/",
    "failureRedirect": "users/login",
    "failureFlash": true
}));

module.exports = router;
