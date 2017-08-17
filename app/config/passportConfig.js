const LocalStrategy = require("passport-local").Strategy;
const getUserByUsername = require("../common/getUserByUsername.js");
const checkCorrectPassword = require("../common/checkCorrectPassword.js");
const getUserByID = require("../common/getUserByID.js");

function passportConfig(passport) {
    // configuration of passport. TODO: move it somewhere else to keep things modulized
    passport.use(new LocalStrategy( { "usernameField": "userName" },
        function(username, password, done) {
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
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        getUserByID(id, function(err, user) {
            done(err, user);
        });
    });
}

module.exports = passportConfig;
