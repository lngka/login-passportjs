function isLoggedIn(req, res) {
    if (res.locals.user) {
        return true;
    } else {
        return false;
    }
}

module.exports = isLoggedIn;
