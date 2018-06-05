var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    middleware = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("users/index");
});

router.get("/admin", middleware.isLoggedIn, middleware.isManager, function(req, res){
    res.render("users/admin");
});

router.get("/admin/employees", middleware.isLoggedIn, middleware.isManager, function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            console.log("Error Occured");
            console.log(err);
        } else {
            res.render("users/employees", {users: allUsers});
        }
    })
});

router.get("/:id", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id).exec(function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "User not found");
            res.redirect("back"); 
        } else {
            console.log(foundUser);
            res.render("users/show", {user: foundUser});
        }
    });
});

router.get("/admin/reports", middleware.isLoggedIn, middleware.isManager, function(req, res){
    res.render("users/reports");
});

router.get("/admin/messages", middleware.isLoggedIn, middleware.isManager, function(req, res){
    res.render("users/messages");
});

module.exports = router;

