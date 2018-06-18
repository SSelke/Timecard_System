var express    = require("express"),
    router     = express.Router({ mergeParams: true }),
    User       = require("../models/user"),
    Message    = require("../models/message"),
    middleware = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function (req, res) {
    res.render("users/index");
});

// Gets messages for regular Employees, not Admins
router.get("/messages", middleware.isLoggedIn, function (req, res) {
    User.find({}).populate("messages").exec(function(err, allUsers) {
        if (err) {
            console.log("Error Occured");
            console.log(err);
        } else {
            res.render("users/messages", { users: allUsers });
        }
    })
});

//================//
// POST A MESSAGE //
//================//

router.post("/messages", middleware.isLoggedIn, function (req, res) {
    User.findOne({ username: req.body.reciever }, (err, foundUser) => {
        if (err) {
            res.redirect("back")
        } else {
            var newMessage = new Message({
                text: req.body.message,
                author: {
                    id: req.user._id,
                    name: req.user.first_name
                }
            });
            User.findOneAndUpdate({ username: req.body.reciever }, { $push: { messages: newMessage } }, (err, updateData) => {
                req.flash("success", "Message Sent!");
                res.redirect("/users/messages");
            })
        }
    })
})


module.exports = router;
