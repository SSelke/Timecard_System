var mongoose = require("mongoose");
var User = require("./models/user");

var data = [
    {
        username: "Scott",
        password: "password",
        first_name: "Scott",
        middle_initial: "W",
        last_name: "Selke",
        phone: "4805555913",
        isManager: true,
        points_accrued: 0
    },
    {
        username: "Jeff",
        password: "password",
        first_name: "Jeff",
        middle_initial: "W",
        last_name: "Griggs",
        phone: "4805550436",
        isManager: true,
        points_accrued: 4
    },
    {
        username: "Maddie",
        password: "password",
        first_name: "Maddie",
        middle_initial: "W",
        last_name: "Smith",
        phone: "4805552222",
        isManager: true,
        points_accrued: 2
    }
]

function seedDB() {
    //Remove all campgrounds
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed users!");
        //add a few campgrounds
        data.forEach(function (seed) {
            User.create(seed, function (err, user) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("added a User");
                    //create a User
                    user.save();
                }
            });
        });
    });
}

module.exports = seedDB;