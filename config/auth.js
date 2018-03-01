'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + '/auth/github/callback',
		'passReqToCallback': true
	},
	'facebookAuth': {
        'clientID': process.env.FACEBOOK_KEY,
        'clientSecret': process.env.FACEBOOK_SECRET,
        'callbackURL': process.env.APP_URL + '/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'email'],
        'passReqToCallback': true
    }
};
