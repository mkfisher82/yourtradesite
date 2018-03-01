// Require common passport module
var common_passport = require('../common/common');

module.exports = function(passport) {

    // from /auth/github
    exports.auth_github = passport.authenticate('github');

    // from /auth/github/callback
    exports.auth_github_callback = passport.authenticate('github', { successRedirect: '/',
                                          failureRedirect: '/failure'});

    // from /auth/facebook
    exports.auth_facebook = passport.authenticate('facebook', { scope : ['public_profile', 'email'] });

    // from /auth/facebook/callback
    exports.auth_facebook_callback = passport.authenticate('facebook', { successRedirect: '/',
                                        failureRedirect: '/failure'});

    exports.get_home = [

        common_passport.isAuthenticated,

        function(req, res) {
            res.render('layout');
        }
    ]

    return exports;
};
