var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    middle_initial: { type: String, required: true },
    last_name: { type: String, required: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    isManager: Boolean,
    isSysAdmin: Boolean,
    points_accrued: Number,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    messages: {
        sent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }],
        recieved: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }],
        archived: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }],
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);