// Require Mongoose Schama's and Passport
var User = require('./models/user');
var Post = require('./models/posts');
var Band = require('./models/bands');
var Agenda = require('./models/agenda');
var passport = require('passport');
var LastfmAPI = require('./apis/lastfm');
var Maps = require('./apis/maps');
var Mandrill = require('./apis/mandrill');
var fs = require("fs");
var busboy = require('connect-busboy');

// Export As App
module.exports = function(app) {

    // Route Index
    app.get('/', function(req, res) {
        res.render('index', {
            sessionUser: req.user
        });
    });

    // REGISTER / LOG USERS
    // Route Login Form: Passport Authenticates Logins
    app.post('/auth/login', passport.authenticate('local-login', {
        successRedirect: '/app',
        failureRedirect: '../#failed',
        failureFlash: true
    }));
    // Route Signup form: Passport Authenticate Signups
    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/app',
        failureRedirect: '../#signup-failed',
        failureFlash: true
    }));
    // Route Facebook Register
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'public_profile']
    }));
    // Route Facebook Callback
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        // Facebook Signup Failed
        failureRedirect: '/login'
    }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/app');
    });
    // Route Google Register
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
    // Route Google Callback
    app.get('/auth/google/callback', passport.authenticate('google', {
        // Google Signup Failed
        failureRedirect: '/login'
    }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/app');
    });
    // Route Twitter Register
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: ['email', 'profile']
    }));
    // Route Twitter Callback
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        // Google Signup Failed
        failureRedirect: '/login'
    }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/app');
    });
    // Route Logout
    app.get('/logout', function(req, res) {
        // req.logOut();
        // res.redirect('/');
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    // ANGULAR API EXCHANGE
    // USERS
    app.get('/api/users', function(req, res) {
        User.find({}, function(err, data) {
            if (err) return next(err);
            res.json({
                sessionUser: req.user,
                users: data
            });
        });
    });
    app.get('/api/users/:id', function(req, res) {
        User.findById(req.params.id, function(err, data) {
            if (err) return err;
            if (typeof(req.user) !== 'undefined') {
                if (req.params.id === req.user.id ? ownPage = true : ownPage = false);
                res.json({
                    ownPage: ownPage,
                    sessionUser: req.user,
                    user: data
                });
            }
            else {
                res.json({
                    ownPage: false,
                    user: data
                });
            }
        });
    });
    app.put('/api/users/:id/address', function(req, res) {
        User.update({ _id: req.params.id }, { $set: { profile: { city: req.body.city, postcode: req.body.postcode }}}, function(err, data){
            res.json(data);
        });
    });
    app.put('/api/users/:id/bio', function(req, res) {
        User.update({ _id: req.params.id }, { $set: { profile: {bio: req.body.bio }}}, function(err, data){
            res.json(data);
        });
    });
    app.put('/api/users/:id/instrument', function(req, res) {
        User.update({ _id: req.params.id }, {$push: {instruments: {name: req.body.instrument, experience: req.body.experience}}}, function(err, data){
            res.json(data);
        });
    });
    app.delete('/api/users/:id/instrument/:instrumentId', function(req, res) {
        User.update(
            { _id: req.params.id }, { $pull: { 'instruments': { _id: req.params.instrumentId } } }, function(err, data){
                if (err) return err;
                res.json(data);
            }
        );
    });
    app.put('/api/users/:id/genre', function(req, res) {
        User.update({ _id: req.params.id }, {$push: {genres: {name: req.body.genre}}}, function(err, data){
            res.json(data);
        });
    });
    app.delete('/api/users/:id/genre/:genreId', function(req, res) {
        User.update(
            { _id: req.params.id }, { $pull: { 'genres': { _id: req.params.genreId } } }, function(err, data){
                if (err) return err;
                res.json(data);
            }
        );
    });
    app.put('/api/users/:id/artist', function(req, res) {
        LastfmAPI.artist.getInfo({
            'artist': req.body.artist
        }, function(err, artist) {
            if (err) {
                res.redirect('/app/profile/' + req.user._id);
                return;
            } else {
                var artistName = artist.name;
                var artistImage = artist.image[3]['#text'];
                var artistBio = artist.bio.summary;
                User.update({_id: req.params.id}, {$push: {artists: {name: artistName, image: artistImage, bio: artistBio}}}, function(err, data) {
                    if (err) return err;
                    res.json(data);
                });
            }
        });
    });
    app.get('/api/users/:id/artist/:artistId', function(req, res) {
        User.findById(req.params.id, function(err, user){
            res.json(user.artists.id(req.params.artistId));
        });
    });
    app.delete('/api/users/:id/artist/:artistId', function(req, res) {
        User.update(
            { _id: req.params.id }, { $pull: { 'artists': { _id: req.params.artistId } } }, function(err, data){
                if (err) return err;
                res.json(data);
            }
        );
    });
    app.put('/api/users/:id/start', function(req, res) {
        User.findById(req.user._id, function (err, user) {
            user.lookingForBand = true;
            user.save(function(err){
                if (err) return next(err)
                res.json('Started');
            })
        });
    });
    app.put('/api/users/:id/stop', function(req, res) {
        User.findById(req.user._id, function (err, user) {
            user.lookingForBand = false;
            user.save(function(err){
                if (err) return next(err)
                res.json('Stopped');
            })
        });
    });

    // AGENDAS
    app.get('/api/agendas', function(req, res, next) {
      if(req.query.location) {
        var radius = req.query.radius;
        var geocodeParams = { "address": req.query.location };
        Maps.geocode(geocodeParams, function(err, result){
            if (err) return next(err);
            var lat = result.results[0].geometry.location.lat;
            var lng = result.results[0].geometry.location.lng;
            Agenda.find({ loc: { $within: { $centerSphere: [ [lng, lat], radius / 3963.192 ] } } }, function(err, foundAgendas) {
                Agenda.populate(foundAgendas, {path: 'bandID'}, function(err, foundAgendas){
                    if (err) return next(err);
                    res.json({
                        sessionUser: req.user,
                        agendas: foundAgendas
                    });
                });
            });
        });
      } else {
        Agenda.find({}).sort('-postedDate').find({}, function(err, data) {
          Agenda.populate(data, {path: 'bandID'}, function(err, data){
            if (err) return err;
            res.json({
              sessionUser: req.user,
              agendas: data
            });
          });
        });
      }
    });
    app.get('/api/agendas/:id', function(req, res) {
        Agenda.findById({_id: req.params.id},function(err, data){
            if (err) return err;
            res.json(data)
        });
    });
    app.delete('/api/agendas/:id', function(req, res) {
      Agenda.remove({_id: req.params.id},function(err, data){
        if (err) return err;
        res.json(data)
      });
    });

    app.post('/api/agendas/:id', function(req, res) {
        var newAgenda = new Agenda();
        var agendaID = newAgenda._id;
        var geocodeParams = { "address": req.body.venture + ' ' + req.body.location };
        newAgenda.bandID = req.params.id,
        newAgenda.date = req.body.date,
        newAgenda.venture = req.body.venture,
        newAgenda.location = req.body.location,
        newAgenda.time = req.body.time,
        newAgenda.price = req.body.price,
        Band.update({_id: req.params.id}, {$push: {agendas: newAgenda._id}}, function(err, data) {
            if (err) return err;
        });
        Maps.geocode(geocodeParams, function(err, result){
            if(err) return err;
            newAgenda.loc.y = result.results[0].geometry.location.lat;
            newAgenda.loc.x = result.results[0].geometry.location.lng;
            newAgenda.save(function (err, band) {
                if (err) return err;
                res.json(band);
            });
        });
    });

    // BANDS
    app.get('/api/bands', function(req, res) {
      if (req.query.location){
        var radius = req.query.radius;
        var geocodeParams = { "address": req.query.location };
        Maps.geocode(geocodeParams, function(err, result){
            if (err) return next(err);
            var lat = result.results[0].geometry.location.lat;
            var lng = result.results[0].geometry.location.lng;
            Band.find({ loc: { $within: { $centerSphere: [ [lng, lat], radius / 3963.192 ] } } }, function(err, foundBands) {
                if (err) return next(err);
                res.json({
                    sessionUser: req.user,
                    bands: foundBands
                });
            });
        });
      } else {
        Band.find({}).sort('-postedDate').find({}, function(err, data) {
          if (err) return err;
          res.json({
            sessionUser: req.user,
            bands: data
          });
        });
      }
    });
    app.post('/api/bands', function(req, res) {
        var newBand = new Band();
        newBand.name = req.body.bandname,
        newBand.bio = req.body.bandbio,
        newBand.genres = req.body.bandgenres,
        newBand.city = req.body.bandcity,
        newBand.members = req.user._id
        var geocodeParams = { "address": req.body.bandcity };
        Maps.geocode(geocodeParams, function(err, result){
            if(err) {
                newBand.save(function (err, band) {
                    if (err) return handleError(err);
                    res.json(band);
                });
            }
            else {
                newBand.loc.y = result.results[0].geometry.location.lat;
                newBand.loc.x = result.results[0].geometry.location.lng;
                newBand.save(function (err, band) {
                    if (err) return handleError(err);
                    res.json(band);
                });
            }
        });
    });

    app.get('/api/bands/:id', function(req, res) {
        var populateQuery = [{path:'members', select:'_id'}, {path:'agendas'}];
        Band.findById(req.params.id).populate(populateQuery).exec(function(err, data){
            var adminRights = false;
            var index = -1;
            if (typeof(req.user) !== 'undefined') {
                for(var i = 0, len = data.members.length; i < len; i++) {
                    if (JSON.stringify(data.members[i]._id) == JSON.stringify(req.user._id)) {
                        adminRights = true;
                        index = i;
                        break;
                    }
                }
                if (err) return err;
                res.json({
                    adminRights: adminRights,
                    sessionUser: req.user,
                    band: data
                });
            } else {
                res.json({
                    adminRights: false,
                    band: data
                });
            }
        });
    });
    // MUSICIANS
    app.get('/api/musicians', function(req, res, next) {
        if (req.query.location) {
          var radius = req.query.radius;
          var geocodeParams = { "address": req.query.location };
          Maps.geocode(geocodeParams, function(err, result){
              if (err) return next(err);
              var lat = result.results[0].geometry.location.lat;
              var lng = result.results[0].geometry.location.lng;
              User.find({}).where('lookingForBand', true).sort('-date').find({ loc: { $within: { $centerSphere: [ [lng, lat], radius / 3963.192 ] } } }, function(err, data) {
                  if (err) return next(err);
                  res.json({
                      sessionUser: req.user,
                      musicians: data
                  });
              });
          });
        } else {
          User.find({}).where('lookingForBand', true).sort('-date').find({}, function(err, data) {
              if (err) return err;
              res.json({
                  sessionUser: req.user,
                  musicians: data
              });
          });
        }
    });

    // ADMIN
    app.get('/admin', isLoggedIn, function(req, res, next) {
        User.findById(req.user.id, function(err, admin) {
            if (err) return err;
            if (admin.admin == true) {
                res.json("Welcome admin! There are " + connectCounter + "users online.");
            } else {
                res.json("Shoo!");
            }
        });
    });

    // SOCKET IO
    connectCounter = 0;
    io.on('connection', function(socket) {
        connectCounter++;
        console.log('Socket: user connected! ' + connectCounter + ' online.');
        socket.on('disconnect', function() {
            connectCounter--;
        });
    });

} // /Module.exports

// IS LOGGED IN?
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
