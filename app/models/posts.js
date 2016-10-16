// Mongoose Post Schema
var mongoose = require('mongoose');
var Post = mongoose.model('Post', {
    post: {
        type: String
    },
    title: {
        type: String
    },
    userID: {
        type: String
    },
    facebookID: {
        type: String
    },
    function: {
        type: Array
    },
    genre: {
        type: Array
    },
    location: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})
module.exports = Post
