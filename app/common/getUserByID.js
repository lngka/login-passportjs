const User = require("../models/user.js");

function getUserByID(id, callback) {
    User.findById(id, function(err, result) {
        callback(err, result);
    });
}

module.exports = getUserByID;
