// Mongoose User Schema
var mongoose = require('mongoose');

var bandSchema = mongoose.Schema({
    name: String,
    bio: String,
    city: String,
    genres: Array,
    image: String,
    agendas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agenda'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    loc: {
        x: Number,
        y: Number
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});
bandSchema.index({
    geolocation: '2d'
});

// Export as User
module.exports = mongoose.model('Band', bandSchema);
