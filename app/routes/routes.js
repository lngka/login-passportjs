const express = require("express");
const router = express.Router();
const isLoggedIn = require("../common/isLoggedIn.js");

router.get("/", function(req, res) {

    if (isLoggedIn(req, res)) {
        res.render("index");
    } else {
        res.redirect("/users/login");
    }
});

module.exports = router;
