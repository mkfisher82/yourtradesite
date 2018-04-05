var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');
var passport_controller = require('../controllers/passportController');
var common_passport = require('../common/common');


module.exports = function(passport) {
    router.get('/', common_passport.isAuthenticated, function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    /* POST home page. */
    router.post('/', user_controller.user_login );

    /* GET publish */
    router.get('/publish/:id', user_controller.publish_get);

    router.get('/home', passport_controller(passport).get_home);

    router.get('/auth/github', passport_controller(passport).auth_github);

    router.get('/auth/github/callback', passport_controller(passport).auth_github_callback);

    router.get('/auth/facebook', passport_controller(passport).auth_facebook);

    router.get('/auth/facebook/callback', passport_controller(passport).auth_facebook_callback);

    // send to facebook to do the authentication
    router.get('/connect/facebook', passport.authorize('facebook', {
      scope : ['public_profile', 'email']
    }));

    router.get('/login', function(req, res) {
    	res.render('login', { title: 'Your Trade Site' });
    });

    router.get('/failure', function(req, res) {
        res.render('failure');
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })

    router.get('/getlocaldata', user_controller.data_get );

	return router;
}
