// Mongoose User Schema
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String,
        firstName: String,
        lastName: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        firstName: String,
        lastName: String,
        locale: String,
        gender: String,
        language: String,
        birthday: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        firstName: String,
        lastName: String,
        profilePicture: String,
        gender: String,
        language: String
    },
    twitter: {
        id: String,
        token: String,
        email: String,
        name: String,
        profilePicture: String,
        gender: String,
        language: String
    },
    artists: [{
        name: String,
        image: String,
        bio: String
    }],
    instruments: [{
        name: String,
        experience: String
    }],
    genres: [{
        name: String
    }],
    memberSince: {
        type: Date,
        required: true,
        default: Date.now
    },
    bio: String,
    profile: {
        city: String,
        bio: String,
        postcode: String
    },
    loc: {
        x: Number,
        y: Number
    },
    admin: Boolean,
    lookingForBand: Boolean
});
userSchema.index({
    geolocation: '2d'
});


userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

// Export as User
module.exports = mongoose.model('User', userSchema);
