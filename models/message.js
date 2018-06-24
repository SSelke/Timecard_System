var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    text: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: { type: String, required: true }
    }
});

module.exports = mongoose.model("Message", messageSchema);