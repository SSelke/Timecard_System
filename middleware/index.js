//All middleware goes here
var User = require("../models/user.js");

var middlewareObj = {};

//Check if User is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("You need to be signed in");
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/");
}

middlewareObj.isManager = function (req, res, next) {
    if (!req.user) {
        req.flash("error", "Please Sign-in!");
        res.redirect("/");
    } else if (req.user.isManager) {
        return next();
    } else {
        console.log("You need to be a manager");
        req.flash("error", "Access Denied");
        res.redirect("back");
    }
}

middlewareObj.isSysAdmin = function (req, res, next) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (foundUser.isSysAdmin) {
            req.flash("error", "Access Denied...");
            res.redirect("back");
        } else {
            next();
        }
    });

}

module.exports = middlewareObj;