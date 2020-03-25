/*jshint esversion: 8 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('Subject', subjectSchema);