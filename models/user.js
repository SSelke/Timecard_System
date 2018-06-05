var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    middle_initial: String,
    last_name: String,
    phone: Number,
    isManager: Boolean,
    points_accrued: Number,
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);