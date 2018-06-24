var express = require("express"),
    router = express.Router({ mergeParams: true }),
    mongoose = require("mongoose"),
    date = require("date-and-time"),
    User = require("../models/user"),
    Message = require("../models/message"),
    Thread = require("../models/thread"),
    middleware = require("../middleware");

// Gets messages for regular Employees, not Admins
router.get("/", middleware.isLoggedIn, function (req, res) {
    User
        .findById(req.user._id)
        .populate({
            path: "messages.recieved",
            model: "Message"
        })
        .populate({
            path: "messages.sent",
            model: "Message"
        })
        .populate({
            path: "threads",
            model: "Thread"
        })
        .exec(function (err, foundUser) {
            if (err || !foundUser) {
                console.log("This is an error", err);
                req.flash("error", "User Not Found");
                res.redirect("back");
            } else {
                User.find({}, function (err, foundUsers) {
                    if (err || !foundUsers) {
                        console.log(err);
                        req.flash("error", "Users Not Found");
                        res.redirect("back");
                    } else {
                        res.render("users/messages", { users: foundUsers, user: foundUser });
                    }
                });
            }
        });
})

router.get("/new", middleware.isLoggedIn, function (req, res) {
    User.find({}, function (err, foundUsers) {
        if (err || !foundUsers) {
            console.log(err);
            req.flash("error", "Users Not Found");
            res.redirect("back");
        } else {
            res.render("messages/new", { users: foundUsers });
        }
    });
});

router.post("/new", middleware.isLoggedIn, function( req, res) {
    User.findById(req.body.reciever, function (err, foundUser) {
        if(err) {
            console.log(err);
            req.flash("error");
            res.redirect("back");
        } else {
            var now = new Date();
            var currentDate = date.format(now, 'MM/DD/YYYY');
            var time = date.format(now, 'hh:mm A');

            const newMessage = {
                text: req.body.message,
                subject: req.body.subject,
                date: currentDate,
                time: time,
                author: {
                    id: req.user._id,
                    name: req.user.first_name + " " + req.user.middle_initial + " " + req.user.last_name
                }
            }

            Message.create(newMessage, function (err, message) {
                const newThread = {
                        subject: req.body.subject,
                        date: currentDate,
                        time: time,
                        author: {
                            id: req.user._id,
                            name: req.user.first_name + " " + req.user.middle_initial + " " + req.user.last_name
                        },
                        recipient: {
                            id: req.body.reciever,
                            name: foundUser.first_name + " " + foundUser.middle_initial + " " + foundUser.last_name
                        },
                        messages: []
                }
                newThread.messages.push(message);
                Thread.create(newThread, function (err, thread) {
                    if(err){
                            console.log("Thread Error", err);
                            res.redirect('back');
                    } else {
                        foundUser.threads.push(thread);
                        foundUser.messages.recieved.push(message);
                        foundUser.save();

                        if(req.user._id !== req.body.reciever) {
                            User.findById(req.user._id, function (err, user) {
                                if(err){
                                    console.log(err);
                                } else {
                                    user.threads.push(thread);
                                    user.messages.sent.push(message);
                                    user.save();
                                }
                            });
                        } else {
                            foundUser.messages.sent.push(message);
                        }
                        req.flash("success", "Message Sent!");
                        res.redirect("/users/messages");
                    }
                });
            });
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, function (req, res) {
    Message.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/messages");
        } else {
            req.flash("success", "Message deleted");
            res.redirect("back");
        }
    });
});

router.get("/:message_id/show", middleware.isLoggedIn, function (req, res) {
    User
        .findOne({ username: req.user.username })
        .populate({
            path: "messages",
            select: "text subject date time author.name"
        })
        .exec(function (err, foundUser) {
            if (err || !foundUser) {
                console.log(err);
                req.flash("error", "User Not Found");
                res.redirect("back");
            } else {
                res.render("messages/show", { user: foundUser, foundMessage: req.params.message_id});
            }
        });
});


module.exports = router;