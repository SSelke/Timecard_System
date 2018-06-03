var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req, res) {
    res.render("login");
});

//authenticate route
router.post("/", passport.authenticate("local",
    {
        successRedirect: "/users",
        failureRedirect: "/"
    }), function (req, res) {
    });

//logout route
router.get("/", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
});

module.exports = router;
