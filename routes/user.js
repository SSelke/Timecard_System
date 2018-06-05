var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    middleware = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("users/index");
});

router.get("/admin", middleware.isManager, function(req, res){
    res.render("users/admin");
});

router.get("/admin/employees", middleware.isManager, function(req, res){
    res.render("users/employees");
});

router.get("/admin/reports", middleware.isManager, function(req, res){
    res.render("users/employees");
});

router.get("/admin/messages", middleware.isManager, function(req, res){
    res.render("users/employees");
});

module.exports = router;

