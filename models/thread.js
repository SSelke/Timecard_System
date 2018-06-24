var mongoose = require("mongoose");

var threadSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread"
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: { type: String, required: true }
    },
    recipient: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: { type: String, required: true }
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    subject: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
});

module.exports = mongoose.model("Thread", threadSchema);