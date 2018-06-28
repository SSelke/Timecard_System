var express = require("express"),
    router = express.Router({ mergeParams: true }),
    mongoose = require("mongoose"),
    date = require("date-and-time"),
    User = require("../models/user"),
    Message = require("../models/message"),
    Thread = require("../models/thread"),
    middleware = require("../middleware");

//===========================//
// DISPLAY ALL MESSAGES     //
//=========================//
router.get("/", middleware.isLoggedIn, function (req, res) {
    User
        // Find user and populate all messages and threads
        .findById(req.user._id)
        .populate({
            path: "messages.recieved",
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
                        res.render("messages/messages", { users: foundUsers, user: foundUser });
                    }
                });
            }
        });
})

//================================//
// DISPLAY ALL SENT MESSAGES     //
//==============================//

router.get("/sent", middleware.isLoggedIn, function (req, res) {
    User
        // Find user and populate all messages and threads
        .findById(req.user._id)
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
                        res.render("messages/sent", { users: foundUsers, user: foundUser });
                    }
                });
            }
        });
})

//====================================//
// DISPLAY ALL ARCHIVED MESSAGES     //
//==================================//

router.get("/archived", middleware.isLoggedIn, function (req, res) {
    User
        // Find user and populate all messages and threads
        .findById(req.user._id)
        .populate({
            path: "messages.archived",
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
                        res.render("messages/archived", { users: foundUsers, user: foundUser });
                    }
                });
            }
        });
})

//===========================//
//     NEW MESSAGE FORM     //
//=========================//

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

//=======================================//
//   CREATES A NEW THREAD AND MESSAGE   //
//=====================================//

router.post("/new", middleware.isLoggedIn, function( req, res) {
    //find user
    User.findById(req.body.reciever, function (err, foundUser) {
        if(err) {
            console.log(err);
            req.flash("error");
            res.redirect("back");
        } else {
            //Because Message is created before a thread, I will need
            //to save the message_id so I can call it back later and
            //then save thread_id so I can add it to the message.thread
            var message_id;
            var thread_id;

            //set the date for the thread and message
            var now = new Date();
            var currentDate = date.format(now, 'MM/DD/YYYY');
            var time = date.format(now, 'hh:mm A');

            //create the new message object
            const newMessage = {
                text: req.body.message,
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
            }

            //create a new message in the DB; Do this before
            //creating a thread because one of the required
            //fields for a thread is a message
            Message.create(newMessage, function (err, message) {

                //create new thread object
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
            
                //saving the message_id for later callback
                message_id = message._id;

                //push message into new thread object
                newThread.messages.push(message);

                //create a new thread.
                Thread.create(newThread, function (err, thread) {
                    if(err){
                            console.log("Thread Error", err);
                            res.redirect('back');
                    } else {
                        //saving thread_id to add to the generated message
                        thread_id = thread._id;
                        console.log(thread_id);

                        //push the thread into the recipients thread array
                        foundUser.threads.push(thread);
                        foundUser.messages.recieved.push(message);
                        foundUser.save();

                        //If the user is sending a message to themselves,
                        //we do not want to make two references to the same thread
                        //check if user_id == reciever_id
                        if(!(req.user._id == req.body.reciever)) {
                            User.findById(req.user._id, function (err, user) {
                                if(err){
                                    console.log(err);
                                } else {

                                    //push thread into senders thread array
                                    user.threads.push(thread);
                                    user.messages.sent.push(message);
                                    user.save();
                                }
                            });
                        } else {

                            //if user_id == reciever_id push message only into sent array
                            foundUser.messages.sent.push(message);
                        }

                        //Save thread_id into message
                        message.thread = {
                            id: thread_id
                        };
                        message.save();
                        req.flash("success", "Message Sent!");
                        res.redirect("/users/messages");
                    }
                });
            });
        }
    });
});

//================================//
//   Delete A selected Message   //
//==============================//

router.put("/:message_id", middleware.isLoggedIn, function (req, res) {
    User.findById( req.user._id, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {  
                console.log(req.body.sent)
                console.log(req.body.inbox)
                console.log(req.body.archived)
                if(req.body.sent) {
                    user.messages.sent.pull(req.params.message_id);
                } else if(req.body.inbox) {
                    user.messages.recieved.pull(req.params.message_id);
                } else if(req.body.archived) {
                    user.messages.archived.pull(req.params.message_id);
                }
                user.save();
                req.flash("success", "Message deleted");
                res.redirect("back");
            }
        }
    )
});

//===============================//
//   DISPLAY SELECTED MESSAGE   //
//=============================//

router.get("/:message_id/show", middleware.isLoggedIn, function (req, res) {
    User
        .findOne({ username: req.user.username })
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
            model: "Thread",
            populate: {
                path: "messages",
                Model: "Message"
            }
        })
        .exec(function (err, foundUser) {
            if (err || !foundUser) {
                console.log(err);
                req.flash("error", "User Not Found");
                res.redirect("back");
            } else {
                Message.findById(req.params.message_id).populate("message").exec(function(err, message){
                    if(err){
                        console.log(err);
                    } else {
                        Thread.findById(message.thread.id).populate("messages").exec(function(err, thread) {
                            if(err || thread == null){
                                console.log(err);
                                res.redirect("back");
                            } else {
                                res.render("messages/show", { user: foundUser, foundMessage: message, thread: thread});
                            }
                        });
                    }
                });
            }
        });
});

router.put("/:message_id/show", middleware.isLoggedIn, function (req, res) {
    User.findById(req.body.reciever, function (err, foundUser) {
        Message.findById(req.params.message_id, function(err, message) {
            if(err){
                console.log(err);
            } else {
                //set the date for the thread and message
                var now = new Date();
                var currentDate = date.format(now, 'MM/DD/YYYY');
                var time = date.format(now, 'hh:mm A');

                const tempMessage = {
                    text: req.body.message,
                    subject: "RE: " + message.subject,
                    date: currentDate,
                    time: time,
                    thread: {
                        id: message.thread.id
                    },
                    author: {
                        id: req.user._id,
                        name: req.user.first_name + " " + req.user.middle_initial + " " + req.user.last_name
                    },
                    recipient: {
                        id: req.body.reciever,
                        name: foundUser.first_name + " " + foundUser.middle_initial + " " + foundUser.last_name
                    }
                }

                Message.create(tempMessage, function (err, newMessage) {
                    Thread.findById(message.thread.id, function (err, thread) {
                        if(err || thread == null){
                            console.log(err, "or null");
                        } else {
                            thread.messages.push(newMessage);
                            thread.save();
                            //find the author
                            User.findById(req.user._id, function (err, user) {
                                if(err){
                                    console.log(err);
                                } else {

                                    user.messages.sent.push(newMessage);
                                    user.save();
                                    foundUser.messages.recieved.push(newMessage);
                                    foundUser.save();
                                    res.redirect("back");
                                }
                            });
                        }
                    })
                });
            }
        });
    });
});


module.exports = router;