const express          = require("express");
const path             = require("path");
const bodyParser       = require("body-parser");
const cookieParser     = require("cookie-parser");
const exphbs           = require("express-handlebars");
const expressValidator = require("express-validator");
const flash            = require("connect-flash");
const session          = require("express-session");
const passport         = require("passport");
const mongoose         = require("mongoose");

mongoose.connect("mongodb://localhost/login-passportjs");

const routes           = require("./app/routes/routes.js");
const users            = require("./app/routes/users.js");

// init app
const app = express();

// static folder
app.use(express.static(path.join(process.cwd(), "public")));

// view engine
app.set("views", path.join(process.cwd(), "views"));
app.engine("handlebars", exphbs({defaultLayout: "layout"}));
app.set("view engine", "handlebars");

// bodyParsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(cookieParser());

// express session
app.use(session({
    "secret": "mysecret",
    "saveUninitialized": true,
    "resave": true
}));

// setup flash
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// init passport
app.use(passport.initialize());
app.use(passport.session());

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

// setup the routes
app.use("/", routes);
app.use("/users", users);

// start the thing
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
    console.log("Server listens on port " + app.get("port"));
});
