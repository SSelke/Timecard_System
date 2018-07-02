var mongoose = require("mongoose");
var moment   = require("moment");

var timeSchema = mongoose.Schema({
    firstOfWeek: String,
    days: []
});

module.exports = mongoose.model("Time", timeSchema);