var express    = require("express"),
    router     = express.Router({ mergeParams: true }),
    User       = require("../models/user"),
    Message    = require("../models/message"),
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


// Gets reports for all the users timesheets combined.
router.get("/reports", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    res.render("users/reports");
});

router.get("/messages", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.find({}).populate("messages").exec(function (err, allUsers) {
        if (err) {
            console.log("Error Occured");
            console.log(err);
        } else {
            res.render("users/messages", { users: allUsers });
        }
    })
});

router.post("/messages", middleware.isLoggedIn, function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err, "Message Post Error");
            res.redirect("back");
        } else {
            Message.create(req.body.message, function (err, message) {
                if (err) {
                    req.flash("error", "Whoops! Something went wrong...");
                    console.log(err);
                } else {
                    message.author.id = req.user._id;
                    message.author.name = req.user.first_name + " " + req.user.middle_initial + " " + req.user.last_name;
                    message.save();
                    foundUser.messages.push(message);
                    foundUser.save();
                    req.flash("success", "Message Sent!");
                }
            });
        }
    });
});

// view all info on a selected employee
router.get("/:id", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "User not found");
            res.redirect("back");
        } else {
            console.log(foundUser);
            res.render("users/show2", { user: foundUser });
        }
    });
});

//PASSWORD RESET
router.put("/:id", function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {

        if (err) {
            res.redirect("/" + req.params.id);
        } else {
            updatedUser.setPassword(req.body.user.password, function () {
                if (err) {
                    console.log(err);
                    console.log("Password reset error...")
                }
                updatedUser.password = req.body.user.password;
                updatedUser.save();
            });
            res.redirect("/users/employees");
        }
    })
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