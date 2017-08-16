const User = require("../models/user.js");

function getUserByUsername(userName, callback) {
    var query = {"username": userName};
    User.findOne(query, function(err, result) {
        callback(err, result);
    });
}

module.exports = getUserByUsername;
