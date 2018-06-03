var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    middleware = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err, currentUser){
        if(err){
            console.log("error occured");
            console.log(err);
        } else {
            res.render("users/index", {user: currentUser});
        }
    });
});

module.exports = router;

