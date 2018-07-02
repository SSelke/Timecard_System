var express = require("express"),
    router = express.Router({ mergeParams: true }),
    User = require("../models/user"),
    Time = require("../models/time"),
    Message = require("../models/message"),
    moment = require("moment"),
    date = require("date-and-time"),
    middleware = require("../middleware");

// Gets reports for all the users timesheets combined.
router.get("/", middleware.isLoggedIn, middleware.isManager, function (req, res) {
    //Get first and last day of Current Week
    var s = moment().startOf('isoWeek');
    var e = moment().endOf('isoWeek');

    //get all days of current week
    var weekDay = s;
    var weekDays = [];
    while (weekDay <= e) {
        weekDays.push(weekDay.format("ddd, Do"));
        weekDay = weekDay.clone().add(1, 'd');
    }

    var newWeek = {
        firstOfWeek: s,
        days: weekDays
    }

    Time.create(newWeek, function (err, newTime) {
        if(err){
            console.log(err);
        }
    });

    var start = moment().startOf('isoWeek').format("ddd, Do");

    User.find({ isManager: true }, function (err, managers) {
        if (err) {
            console.log(err);
        } else {
            User.find({ isManager: false }, function (err, employees) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("scheduling/scheduling", { managers: managers, employees: employees, week: weekDays });
                }
            });
        }
    })
});

module.exports = router;
