var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

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
        username:       req.body.username,
        first_name:     req.body.first_name,
        password:       req.body.password,
        middle_initial: req.body.middle_initial,
        last_name:      req.body.last_name,
        phone:          req.body.phone,
        points_accrued: 0,
        address:        req.body.address,
        email:          req.body.email,
        isManager:      req.body.isManager,
        isSysAdmin:     req.body.isSysAdmin
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("register", { error: err.message }, console.log(err));
        }
        res.redirect("/admin/employees");
    });
});

//authenticate route
router.post("/", passport.authenticate("local",
    {
        successRedirect: "/users",
        failureRedirect: "/",
        badRequestMessage: 'Missing username or password.',
    }), function (req, res) {
    });

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
});

module.exports = router;