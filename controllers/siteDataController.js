var SiteData = require('../models/siteDataModel');
var mongoose = require('mongoose');
var ServiceFeature = require('../models/serviceFeatureModel');
var common_passport = require('../common/common');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Client details form controllers
exports.client_form_get = [
    common_passport.isAuthenticated,


    // findById to get fields
    function(req, res, next) {
        SiteData.findById(req.session.passport.user)
        .exec(function(err, client_data) {
            if (err) {return next(err); }
            console.log(client_data);
            // Render form with existing client data
            res.render('forms/clientForm', { title: 'Client Input Form', client: client_data } );
        })
    }
]

exports.client_form_post = [

    common_passport.isAuthenticated,

    // Validate fields
    body('client_first_name', 'First name is required').isLength({ min: 1 }).trim(),
    body('client_last_name', 'Last name is required').isLength({ min: 1 }).trim(),
    body('client_email', 'Please enter a valid email').isEmail().trim(),
    body('client_phone', 'Please enter a valid NZ phone number').isNumeric().isLength({min: 10, max: 11}).trim(),

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
        var siteData = new SiteData (
            {
                _id:req.session.passport.user, //This is required, or a new ID will be assigned!

                client_details: {
                    client_first_name: req.body.client_first_name,
                    client_last_name: req.body.client_last_name,
                    client_email: req.body.client_email,
                    client_phone: req.body.client_phone
                }
            }
        );
        console.log('Created siteData');
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages
            res.render('forms/clientForm',
            {
                title: 'Client Input Form',
                client: siteData,
                errors: errors.array()
            });
        }
        else {
            // Data from form is valid. Save or Update the record.

            if (req.session.passport.user===undefined){ // Create new document
                console.log('User no longer logged in');
                res.redirect('/login');
            }
            else {
                SiteData.findByIdAndUpdate(req.session.passport.user, siteData, {upsert: true}, function (err) {
                    if (err) { return next(err); }
                        // Succesful - go to business form
                        res.redirect('/sitedata/business/');
                    }
                );
            }
        }
    }
];

// Business details form controllers
exports.business_form_get = [
    common_passport.isAuthenticated,

    // findById to get fields
    function(req, res, next) {
        SiteData.findById(req.session.passport.user)
        .exec(function(err, client_data) {
            if (err) {return next(err); }
            // Render form with existing client data
            res.render('forms/businessForm', { title: 'Business Input Form', client: client_data } );
        })
    }
]

exports.business_form_post = [

    common_passport.isAuthenticated,

    // Validate fields
    body('business_name', 'Business name is required').isLength({ min: 1 }).trim(),
    body('business_slogan', 'Business slogan is required').isLength({ min: 1 }).trim(), // TODO is this really required?
    body('owner_first_name', 'Owner first name is required').isLength({ min: 1 }).trim(),
    body('trade', 'Trade is required').isLength({ min: 1 }).trim(),
    body('years_in_trade', 'How much trade experience do you have').isNumeric().isLength({min: 1}).trim(),

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
        var siteData = new SiteData (
            {
                _id:req.session.passport.user, //This is required, or a new ID will be assigned!

                business_details: {
                    business_name: req.body.business_name,
                    business_slogan: req.body.business_slogan,
                    owner_first_name: req.body.owner_first_name,
                    owner_last_name: req.body.owner_last_name,
                    trade: req.body.trade,
                    years_in_trade: req.body.years_in_trade
                }
            }
        );
        console.log('Created siteData');
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages
            res.render('forms/businessForm',
            {
                title: 'Business Input Form',
                client: siteData,
                errors: errors.array()
            });
        }
        else {
            // Data from form is valid. Save or Update the record.

            if (req.session.passport.user===undefined){ // Create new document
                console.log('User no longer logged in');
                res.redirect('/login');
            }
            else {
                SiteData.findByIdAndUpdate(req.session.passport.user, siteData, {upsert: true}, function (err) {
                    if (err) { return next(err); }
                        // Succesful - go to service features form
                        res.redirect('/sitedata/contact');
                    }
                );
            }
        }
    }
];

// Contact details form controllers
exports.contact_form_get = [
    common_passport.isAuthenticated,

    // findById to get fields
    function(req, res, next) {
        SiteData.findById(req.session.passport.user)
        .exec(function(err, client_data) {
            if (err) {return next(err); }
            req.body.client_data = client_data;
            next();
        })
    },

    sanitizeBody('client_data.contact_details.address.street').trim().unescape(),

    // render page
    function(req, res, next) {
        // Render form with existing client data
        res.render('forms/contactForm', { title: 'Contact Details Input Form', client: req.body.client_data } );
    }

]

exports.contact_form_post = [

    common_passport.isAuthenticated,

    // Validate fields
    body('address_street', 'Street address is required').isLength({ min: 1 }).trim(),
    body('address_suburb', 'Suburb is required').isLength({ min: 1 }).trim(), // TODO is this really required?
    body('address_city', 'City is required').isLength({ min: 1 }).trim(),
    body('contact_email', 'Please enter a valid email address').isEmail().trim(),
    body('contact_phone', 'Please enter a phone number').isNumeric().isLength({min: 10, max: 11}).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization
    function(req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a new object with escaped and trimmed data.
        var siteData = new SiteData (
            {
                _id:req.session.passport.user, //This is required, or a new ID will be assigned!

                contact_details: {
                    address: {
                        street: req.body.address_street,
                        suburb: req.body.address_suburb,
                        city: req.body.address_city
                    },
                    contact_email: req.body.contact_email,
                    contact_phone: req.body.contact_phone
                }
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages
            res.render('forms/contactForm',
            {
                title: 'Contact Details Input Form',
                client: siteData,
                errors: errors.array()
            });
        }
        else {
            // Data from form is valid. Save or Update the record.

            if (req.session.passport.user===undefined){ // Create new document
                console.log('User no longer logged in');
                res.redirect('/login');
            }
            else {
                SiteData.findByIdAndUpdate(req.session.passport.user, siteData, {upsert: true}, function (err) {
                    if (err) { return next(err); }
                        // Succesful - go to service features form
                        res.redirect('/sitedata/why-use-us');
                    }
                );
            }
        }
    }
];

// Why use us form controllers
exports.why_use_us_get = function(req, res, next) {
    ServiceFeature.find({}, function(err, results) {
        if (err) throw err;
        res.render('forms/serviceFeaturesForm', {results: results});
    });
}

exports.why_use_us_post = [

    // add to user and save to db
    common_passport.isAuthenticated,

    // Validate fields
    // Sanitize fields (using wildcard).
    // Not required

    // Process request after validation and sanitization
    function(req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Convert selection to arrays
        var serviceFeaturesTitleArray = [];
        var serviceFeaturesBodyArray = [];

        // get title and body of chosen features are stored in array
        for (var i = 0; i < req.body.serviceFeatures.length; i++) {
            var value = req.body.serviceFeatures[i];
            var data = JSON.parse(value);
            serviceFeaturesTitleArray.push(data.title);
            serviceFeaturesBodyArray.push(data.body);
        }

        // Create a new object with escaped and trimmed data.
        var siteData = new SiteData (
            {
                _id:req.session.passport.user, //This is required, or a new ID will be assigned!

                service_features: {
                    title: serviceFeaturesTitleArray,
                    body: serviceFeaturesBodyArray
                }
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages
            ServiceFeature.find({}, function(err, results) {
                if (err) throw err;
                res.render('forms/serviceFeaturesForm', {results: results, errors: errors.array()});
            });
        }
        else {
            // Data from form is valid. Save or Update the record.

            if (req.session.passport.user===undefined){ // Create new document
                console.log('User no longer logged in');
                res.redirect('/login');
            }
            else {
                SiteData.findByIdAndUpdate(req.session.passport.user, siteData, {upsert: true}, function (err) {
                    if (err) { return next(err); }
                        // Successful
                        res.redirect('/sitedata/client');
                    }
                );
            }
        }
    }
];
