//All middleware goes here
var User = require("../models/user.js");

var middlewareObj = {};

//Check if User is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/");
}


module.exports = middlewareObj;