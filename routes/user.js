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

// // Gets messages for regular Employees, not Admins
// router.get("/messages", middleware.isLoggedIn, function (req, res) {
//     User
//     .findOne({ username: req.user.username })
//     .populate({
//         path: "messages",
//         select: "text subject date time author.name"
//     })
//     .exec(function (err, foundUser) {
//         if (err || !foundUser) {
//             console.log(err);
//             req.flash("error", "User Not Found");
//             res.redirect("back");
//         } else {
//             User.find({}, function(err, foundUsers){
//                 if (err || !foundUsers) {
//                     console.log(err);
//                     req.flash("error", "Users Not Found");
//                     res.redirect("back");
//                 } else {
//                     res.render("users/messages", { users: foundUsers, user: foundUser });
//                 }
//             });
//         }
//     });
// })

// //================//
// // POST A MESSAGE //
// //================//

// router.post("/messages", middleware.isLoggedIn, function (req, res) {
//     User.findOne({ username: req.body.reciever }, (err, foundUser) => {
//         if (err) {
//             res.redirect("back")
//         } else {
//             var now = new Date();
//             var todaysDate = date.format(now, 'MM/DD/YYYY');
//             var time = date.format(now, 'hh:MM A');
//             const newMessage = {
//                 text: req.body.message,
//                 subject: req.body.subject,
//                 date: todaysDate,
//                 time: time,
//                 author: {
//                     id: req.user._id,
//                     name: req.user.first_name + " " + req.user.middle_initial + " " + req.user.last_name
//                 }
//             }
//             Message.create(newMessage, (err, newMessage) => {
//                 if (err) {
//                     req.flash("error", "Whoops! Something went wrong...");
//                     console.log(err);
//                     res.redirect("/users/messages");
//                 } else {
//                     User.findOneAndUpdate({ username: req.body.reciever }, { $push: { messages: newMessage._id } }, (err, updateData) => {
//                         req.flash("success", "Message Sent!");
//                         res.redirect("/users/messages");
//                     })
//                 }
//             })
//         }
//     })
// })

// router.delete("/messages/id:", middleware.isLoggedIn, function (req, res) {
//     Message.findByIdAndRemove(req.params.id, function (err) {
//         if (err) {
//             console.log(err);
//             res.redirect("/messages");
//         } else {
//             req.flash("success", "Message deleted");
//             res.redirect("/messages");
//         }
//     });
// });


module.exports = router;
