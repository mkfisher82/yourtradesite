
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var SiteData = require('../models/siteDataModel');
var configAuth = require('./auth');


module.exports = function(passport) {
    // Passport set-up here.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        SiteData.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GitHubStrategy({
            clientID: configAuth.githubAuth.clientID,
    		clientSecret: configAuth.githubAuth.clientSecret,
    		callbackURL: configAuth.githubAuth.callbackURL,
            passReqToCallback: configAuth.githubAuth.passReqToCallback
        },
        function(req, accessToken, refreshToken, profile, cb) {

            // Async operation
            process.nextTick(function() {

                // check if user is already logged in
                if (!req.user) {

                    SiteData.findOne({ 'github.id': profile.id }, function (err, user) {

                        if (err) {
                            return cb(err);
                        }
                        if (user) {
                            return cb(null, user);
                        } else {
                            console.log('This user does not have a profile')

                            var newSiteData = new SiteData();

                            newSiteData.github.id = profile.id;
                            newSiteData.github.token = accessToken;
                            newSiteData.github.displayName = profile.displayName;
                            newSiteData.github.email = profile._json.email;

                            newSiteData.save(function (err, result) {
                                if (err) {
                                    throw err;
                                }

                                return cb(null, newSiteData);
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; //pull the user out of the session
                    console.log(user);
                    // update the current users facebook credentials
                    user.github.id = profile.id;
                    user.github.token = accessToken;
                    user.github.displayName = profile.displayName;
                    user.github.email = profile._json.email;

                    // save the users
                    user.save(function(err) {
                        if (err) throw err;

                        return cb(null, user);
                    });
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
        passReqToCallback: configAuth.facebookAuth.passReqToCallback
      },
      function(req, accessToken, refreshToken, profile, cb) {
          console.log(profile);
        process.nextTick(function() {

            // check if user is already logged in
            if (!req.user) {

                SiteData.findOne({ 'facebook.id': profile.id }, function (err, user) {

                    if (err) {
                        return cb(err);
                    }
                    if (user) {
                        return cb(null, user);
                    } else {
                        console.log('This user does not have a profile')

                        var newUser = new SiteData();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.displayName = profile.displayName;
                        newUser.facebook.email = profile._json.email;

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return cb(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; //pull the user out of the session
                console.log(user);
                // update the current users facebook credentials
                user.facebook.id = profile.id;
                user.facebook.token = accessToken;
                user.facebook.displayName = profile.displayName;
                user.facebook.email = profile._json.email;

                // save the users
                user.save(function(err) {
                    if (err) throw err;

                    return cb(null, user);
                });
            }
        });
      }
    ));
}
