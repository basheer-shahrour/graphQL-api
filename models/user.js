const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    createdSessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }],
    uID: {
        type: String,
        require: false
    },
    year: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);