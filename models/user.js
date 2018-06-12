var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    first_name: { type: String, required: true },
    middle_initial: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    isManager: Boolean,
    points_accrued: Number,
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);