var express      = require("express"),
    router       = express.Router({ mergeParams: true }),
    mongoose     = require("mongoose"),
    date         = require("date-and-time"),
    User         = require("../models/user"),
    Message      = require("../models/message"),
    moment       = require("moment"),
    middleware   = require("../middleware");

//INDEX SHOW USER INFO
router.get("/", middleware.isLoggedIn, function (req, res) {
    //Get first and Last day of month
    var startOfMonth = moment().startOf('month');
    var endOfMonth = moment().endOf('month');
    var currentMonth = moment().format("MMMM, YYYY");

    //Get first and last day of Current Week formatted
    var startOfWeek = moment().startOf('isoWeek').format("ddd, Do");
    var endOfWeek = moment().endOf('isoWeek').format("ddd, Do");

    //Get first and last day of Current Week
    var s = moment().startOf('isoWeek');
    var e = moment().endOf('isoWeek');
    
    //Variables
    var days = [];
    var weekDays = [];
    var week = [];
    var month = [];
    var weekRange = [];
    var day = startOfMonth;
    var counter = 0;

    
    //get all days of current week
    var weekDay = s;
    while (weekDay <= e) {
        weekDays.push(weekDay.format("ddd, Do"));
        weekDay = weekDay.clone().add(1, 'd');
    } 
    
    //Get all days in given month
    //Get all week Ranges
    var start = day.format("ddd, Do");
    var end;
    var post = false;
    var weekStr = "";
    var count = 1;
    while (day <= endOfMonth) {

        //Get Start of week and End of Week
        if( count == 7 ) {
            end = day.format("ddd, Do");
            weekStr = "(" + start + " - " + end + ")";
            post = true;
            weekRange.push(weekStr);
            count = 0;
        } else if( count == 1 && post ) {
            start = day.format("ddd, Do");
        }
        //Get all days
        days.push(day.format("ddd, Do"));
        day = day.clone().add(1, 'd');
        count++;
    }

    //Parse out weeks in a given month
    //Get start and end day for each week
    days.forEach(function(day){
        if ( counter == 7 ) {
            counter = 0;
            month.push(week);
            week = [];
        }
        week.push(day);
        counter++;
    });

    //IF month has a 5th week, add in next months days
    if( week.length < 7 ) {
        //get the start of next month
        var firstDay = moment().add(1, 'month');
        var count = week.length;
        var newDay = firstDay;

        //add on next month days
        while( count < 7 ){
            week.push(newDay.format("ddd, Do"));
            newDay = newDay.clone().add(1, 'd');
            count++;
        }

        start = week[0]
        end = week[6]
        weekStr = "(" + start + " - " + end + ")";
        weekRange.push(weekStr);


        //push week into month
        month.push(week);
    }
    
    res.render("users/index", {
        month: month,
        currentMonth: currentMonth,
        startOfWeek: startOfWeek,
        endOfWeek: endOfWeek,
        weekDays: weekDays,
        weekRange: weekRange
    });
});

module.exports = router;