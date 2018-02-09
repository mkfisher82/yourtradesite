var SiteData = require('../models/siteDataModel');
var mongoose = require('mongoose');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Client details form controllers
exports.client_form_get = function(req, res, next) {
        res.render('forms/clientForm', { title: 'Client Input Form' } );
};

exports.client_form_post = [

    function(req, res, next){
        console.log('In the controller');
        return next();
    },

    // Validate fields
    body('client_first_name', 'Error please fix').isLength({ min: 1 }).trim(),
    body('client_last_name', 'Error please fix').isLength({ min: 1 }).trim(),
    body('client_email', 'Error please fix').isEmail().trim(),
    body('client_phone', 'Error please fix').isNumeric().isLength({min: 10, max: 11}).trim(),

    function(req, res, next){
        console.log('Validated fields');
        return next();
    },

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    function(req, res, next){
        console.log('Sanitized fields');
        return next();
    },

    // Process request after validation and sanitization
    function(req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a new object with escaped and trimmed data.
        var client = {
            client_first_name: req.body.client_first_name,
            client_last_name: req.body.client_last_name,
            client_email: req.body.client_email,
            client_phone: req.body.client_phone
        };

        console.log('Created object');

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages

            res.render('forms/clientForm',
            {
                title: 'Client Input Form',
                client: client,
                errors: errors.array()
            });
        }
        else {
            // Data from form is vaild. Save to db.
            client.save(function (err) {
                if (err) { return next(err); }
                // Succesful - go to business form
                res.redirect('/sitedata/business/' + req.params.id);
            });
        }
    }
];

// Business details form controllers
exports.business_form_get = function(req, res, next) {
        res.render('forms/businessForm', { title: 'Business Details Input Form' } );
};

exports.business_form_post = function(req, res, next) {
        res.redirect('/sitedata/contact/' + req.params.id);
};

// Contact details form controllers
exports.contact_form_get = function(req, res, next) {
        res.render('forms/contactForm', { title: 'Contact Details Input Form' } );
};

exports.contact_form_post = function(req, res, next) {
        res.redirect('/sitedata/client/' + req.params.id);
};
