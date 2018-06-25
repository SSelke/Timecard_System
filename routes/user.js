var express      = require("express"),
    router       = express.Router({ mergeParams: true }),
    mongoose     = require("mongoose"),
    date         = require("date-and-time"),
    User         = require("../models/user"),
    Message      = require("../models/message"),
    middleware   = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function (req, res) {
    res.render("users/index");
});

module.exports = router;
