const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {

    if (req.isAuthenticated()) {
        res.render("index");
    } else {
        res.redirect("/users/login");
    }
});

module.exports = router;
