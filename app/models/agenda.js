// Mongoose User Schema
var mongoose = require('mongoose');

var agendaSchema = mongoose.Schema({
    date: String,
    venture: String,
    location: String,
    time: String,
    price: String,
    bandID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Band'
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    loc: {
        x: Number,
        y: Number
    }
});
agendaSchema.index({
    geolocation: '2d'
});

// Export as User
module.exports = mongoose.model('Agenda', agendaSchema);
