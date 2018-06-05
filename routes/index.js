var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req, res) {
    res.render("login");
});

//register route
router.get("/register", function (req, res) {
    res.render("register");
});

//hadles sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username, 
        first_name: req.body.first_name, 
        middle_initial: req.body.middle_initial, 
        last_name: req.body.last_name,
        phone: req.body.phone,
        points_accrued: 0
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("register", { error: err.message }, console.log(err));
        }
        console.log(req.body.last_name);
        passport.authenticate("local")(req, res, function () {
            res.redirect("/users");
        });
    });
});

//authenticate route
router.post("/", passport.authenticate("local",
    {
        successRedirect: "/users",
        failureRedirect: "/"
    }), function (req, res) {
    });

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
});

module.exports = router;
