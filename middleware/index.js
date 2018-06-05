//All middleware goes here
var User = require("../models/user.js");

var middlewareObj = {};

//Check if User is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("You need to be signed in");
    // req.flash("error", "You need to be logged in to do that!");
    res.redirect("/");
}

middlewareObj.isManager = function(req, res, next){
    if(!req.user){
        console.log("You need to be a signed in to do that");
        res.redirect("/"); 
    } else if(req.user.isManager){
        return next();
    } else {
        console.log("You need to be a manager");
        // req.flash("error", "You need to be logged in to do that!");
        res.redirect("/");
    }
}


module.exports = middlewareObj;