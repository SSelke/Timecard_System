var express    = require("express"),
    router     = express.Router({ mergeParams: true }),
    User       = require("../models/user"),
    Time       = require("../models/time"),
    Message    = require("../models/message"),
    moment     = require("moment"),
    date       = require("date-and-time"),
    middleware = require("../middleware");

// For admin use to view, create, update, and destroy users
router.get("/employees", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log("Error Occured");
            console.log(err);
        } else {
            res.render("users/employees", { users: allUsers });
        }
    })
});

//UPDATE USER INFO
router.put("/:id/edit", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.redirect("back");
        } else {
            user.username = req.body.username;
            user.first_name = req.body.first_name;
            user.middle_initial = req.body.middle_initial;
            user.last_name = req.body.last_name;
            user.phone = req.body.phone;
            user.address = req.body.address;
            user.email = req.body.email;
            user.isManager = req.body.isManager;
            user.save();
            req.flash("success", user.first_name + "'s Profile Updated");
            res.redirect("/admin/employees");
        }
    })
});

// view all info on a selected employee to edit
router.get("/:id/edit", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "User not found");
            res.redirect("back");
        } else {
            res.render("users/edit", { user: foundUser });
        }
    });
});

// view all info on a selected employee
router.get("/:id/show", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "User not found");
            res.redirect("back");
        } else {
            res.render("users/show", { user: foundUser });
        }
    });
});

// Deletes a given employee for admin use only
router.delete("/:id", middleware.isLoggedIn, middleware.isManager, middleware.isSysAdmin, function (req, res) {

    // Admin cannot delete themselves, blocks possibility of having no users
    if (req.params.id == req.user._id) {
        req.flash("error", "Cannot Delete Yourself");
        res.redirect("back");
    } else {

        // Finds user, and deletes them
        User.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                console.log(err);
                res.redirect("/admin/employees");
            } else {
                req.flash("success", "User successfully deleted");
                res.redirect("/admin/employees");
            }
        });
    }
});

module.exports = router;