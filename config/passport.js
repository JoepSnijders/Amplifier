// Dependencies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Maps = require('../app/apis/maps');

// User Shema Mongoose
var User = require('../app/models/user');

// Facebook and Twitter Keys
var configAuth = require('./auth.js');

module.exports = function(passport) {

        // Serialize
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        // Deserialize
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

        // Create Local-Signup Strategy
        passport.use('local-signup', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, email, password, done) {
                process.nextTick(function() {
                    User.findOne({
                        'local.username': email
                    }, function(err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email already taken.'));
                        } else {
                            // Register New User to Database
                            var newUser = new User();
                            newUser.local.username = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.firstName = req.body.firstName;
                            newUser.local.lastName = req.body.lastName;
                            newUser.profile.city = req.body.city;

                            newUser.save(function(err) {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }));

        // Create Local Login Strategy
        passport.use('local-login', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, email, password, done) {
                process.nextTick(function() {
                    User.findOne({
                        'local.username': email
                    }, function(err, user) {
                        if (err)
                            return done(err);
                        if (!user)
                            return done(null, false, req.flash('loginMessage', 'No user found.'));
                        if (!user.validPassword(password))
                            return done(null, false, req.flash('loginMessage', 'Invalid password.'));
                        return done(null, user);
                    })
                })
            }));

        // Create Facebook Strategy
        passport.use(new FacebookStrategy({
                clientID: configAuth.facebookAuth.clientID,
                clientSecret: configAuth.facebookAuth.clientSecret,
                callbackURL: configAuth.facebookAuth.callbackURL
            },
            function(accessToken, refreshToken, profile, done) {
                process.nextTick(function() {
                    User.findOne({
                        'facebook.id': profile.id
                    }, function(err, user) {
                        // Error
                        if (err)
                            return done(err);
                        // Returning user
                        if (user)
                            return done(null, user);
                        // New user
                        else {
                            console.log('Facebook Signup: ' + profile.name.givenName + ' ' + profile.name.familyName + '!');
                            // Register Facebook Data
                            var newUser = new User();
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = accessToken;
                            newUser.facebook.firstName = profile.name.givenName;
                            newUser.facebook.lastName = profile.name.familyName;
                            newUser.facebook.email = profile.emails[0].value;
                            newUser.facebook.language = profile._json.locale;
                            newUser.facebook.gender = profile.gender;
                            newUser.profile.city = profile._json.location.name;
                            newUser.facebook.birthday = profile._json.birthday;

                            var geocodeParams = { "address": profile._json.location.name };
                            Maps.geocode(geocodeParams, function(err, result){
                                if(err) {
                                    // Location not found, save the rest.
                                    newUser.save(function (err, band) {
                                        if (err) throw err;
                                        return done(null, newUser);
                                    });
                                }
                                else {
                                    // Location found, save it.
                                    newUser.loc.y = result.results[0].geometry.location.lat;
                                    newUser.loc.x = result.results[0].geometry.location.lng;
                                    newUser.save(function (err) {
                                        if (err) throw err;
                                        return done(null, newUser);
                                    });
                                }
                            });
                        }
                    });
                });
            }));

        // Create Google Strategy
        passport.use(new GoogleStrategy({
                clientID: configAuth.googleAuth.clientID,
                clientSecret: configAuth.googleAuth.clientSecret,
                callbackURL: configAuth.googleAuth.callbackURL
            },
            function(accessToken, refreshToken, profile, done) {
                process.nextTick(function() {
                    User.findOne({
                        'google.id': profile.id
                    }, function(err, user) {
                        // Error
                        if (err)
                            return done(err);
                        // Returning user
                        if (user)
                            return done(null, user);
                        // New user
                        else {
                            console.log('Google Signup: ' + profile.name.givenName + ' ' + profile.name.familyName + '!');
                            // Register Facebook Data
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.profilePicture = profile.photos[0].value;
                            newUser.google.token = accessToken;
                            newUser.google.gender = profile.gender;
                            newUser.google.firstName = profile.name.givenName;
                            newUser.google.lastName = profile.name.familyName;
                            newUser.google.email = profile.emails[0].value;
                            newUser.google.gender = profile.gender;
                            newUser.google.language = profile._json.language;
                            console.log(profile);
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });

                            // Register Mailchimp data
                            var mcReq = {
                                id: 'a3cb5467cd',
                                email: { email: profile.emails[0].value },
                                merge_vars: {
                                    EMAIL: profile.emails[0].value,
                                    FNAME: profile.family_name,
                                    LNAME: profile.display_name
                                }
                            };

                            // Submit subscription request to mail chimp.
                            mc.lists.subscribe(mcReq, function(data) {
                                console.log("New Mailchimp info added:" + data);
                            }, function(error) {
                                console.log(error);
                            });

                        }
                    });
                });
            }));


        // Create Twitter Strategy
        passport.use(new TwitterStrategy({
                consumerKey: configAuth.twitterAuth.consumerKey,
                consumerSecret: configAuth.twitterAuth.consumerSecret,
                callbackURL: configAuth.twitterAuth.callbackURL
            },
            function(accessToken, refreshToken, profile, done) {
                process.nextTick(function() {
                    User.findOne({
                        twitterId: profile.id
                    }, function(err, user) {
                        // Error
                        if (err)
                            return done(err);
                        // Returning user
                        if (user)
                            return done(null, user);
                        // New user
                        else {
                            console.log(profile);
                            console.log('Twitter Signup: !');
                            // Register Twitter Data
                            var newUser = new User();
                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = accessToken;
                            newUser.twitter.name = profile.displayName;
                            newUser.twitter.language = profile.lang;
                            newUser.twitter.profilePicture = profile.photos[0].value;

                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }));

    } // /Module-exports
