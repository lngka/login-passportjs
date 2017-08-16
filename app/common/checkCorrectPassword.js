const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");

function checkCorrectPassword(submittedPassword, hash, callback) {
    bcryptjs.compare(submittedPassword, hash, function(err, isCorrect) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, isCorrect);
        }

    });
}

module.exports = checkCorrectPassword;
