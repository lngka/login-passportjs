const bcryptjs = require("bcryptjs");
const User = require("../models/user.js");

function createUser(userName, password, email, callback) {
    bcryptjs.genSalt(10, function(err, salt) {
        bcryptjs.hash(password, salt, function(err, hash) {
            if (err) throw err;

            var newUser = new User({
                "username": userName,
                "password": hash,
                "email": email
            });

            newUser.save(function(err) {callback(err);});
        });
    });
}

module.exports = createUser;
