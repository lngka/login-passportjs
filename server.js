const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/login-passportjs");
const db = mongoose.connection;

const routes = require("./app/routes/routes.js");
const users = require("./app/routes/users.js");

// init
const app = express();

// view engine
app.set("views", path.join(process.cwd(), "views"));
app.engine("handlebars", exphbs({defaultLayout: "layout"}));
app.set("view engine", "handlebars");

// bodyParsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(cookieParser());

// express validator
app.use(expressValidator({
    "errorFormater": function(param, msg, value) {
        var namespace = param.split(".");
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += "[" + namespace.shift() + "]";
        }
        return {
            "param": formParam,
            "msg": msg,
            "value": value
        };
    }
}));

// static folder
app.use(express.static(path.join(process.cwd(), "public")));

// express session
app.use(session({
    "secret": "mysecret",
    "saveUninitalized": true,
    "resave": true
}));

// setup flash
app.use(flash());

app.use(function(res, req, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
    console.log("Server listens on port " + app.get("port"));
})
