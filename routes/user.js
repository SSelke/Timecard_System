var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    middleware = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("users/index");
});

//ADMIN USE ONLY - SHOWS ALL EMPLOYEES
router.get("/employees", middleware.isLoggedIn, middleware.isManager, function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            console.log("Error Occured");
            console.log(err);
        } else {
            res.render("users/employees", {users: allUsers});
        }
    })
});


//GETS USER REPORTS
router.get("/reports", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    res.render("users/reports");
});

//GETS MESSAGES
router.get("/messages", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    res.render("users/messages");
});

router.get("/:id", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    User.findById(req.params.id).exec(function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "User not found");
            res.redirect("back"); 
        } else {
            console.log(foundUser);
            res.render("users/show2", {user: foundUser});
        }
    });
});

//PASSWORD RESET
router.put("/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){

        if(err){
            res.redirect("/" + req.params.id);
        } else {
            updatedUser.setPassword(req.body.user.password, function(){
                if(err){
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

router.delete("/:id", middleware.isLoggedIn, middleware.isManager, function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/users/employees");
        } else {
            res.redirect("/users/employees");
        }
    });
});


module.exports = router;

