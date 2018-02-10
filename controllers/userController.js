var SiteData = require('../models/siteDataModel');
var mongoose = require('mongoose');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Validate, sanitize and save name
exports.user_login = [

    // Validate that the name field is not empty.
    body('client_email', 'Please enter a valid email').isEmail().trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('client_email').trim().escape(),

    //Process request after validation and sanitization
    function (req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a siteData object with escaped and trimmed data
        var siteData = new SiteData (
            { client_email: req.body.client_email }
        );

        if (!errors.isEmpty()) {
            // There are Errors. Render the form again with sanitized values/errors messages.
            res.render('index', { title: 'Welcome to YTS', email: siteData, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if client email exists in db.
            SiteData.findOne( { 'client_details.client_email': req.body.client_email } )
            .exec( function (err, found_email) {
                if (err) { return next(err); }

                if (!found_email) {
                    // Email not in db. Prompt new email or sign up
                    let errormsg = ["This email is not registered. Please check the email or sign up"];
                    res.render('index', { title: 'Welcome to YTS', email: siteData, errors: errormsg });
                }
                else {
                    // Email exists. Go to client details form with id
                        res.redirect('/sitedata/client/' + found_email._id);
                }
            });
        }
    }
];

exports.user_welcome_get = function(req, res, next) {

    User.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err); }

        res.render('welcome', { name: results.name, link: '/sitedata/client/' + req.params.id } );
    });

};

exports.user_welcomeback_get = function(req, res, next) {

    User.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err); }

        res.render('welcome', { name: results.name, link: '/sitedata/client/' + req.params.id } );
    });

};
