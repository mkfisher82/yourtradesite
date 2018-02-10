var SiteData = require('../models/siteDataModel');
var mongoose = require('mongoose');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Client details form controllers
exports.client_form_get = function(req, res, next) {

    if (req.params.id!==undefined) { // Existing client so populate fields

        // findById to get fields
        SiteData.findById(req.params.id)
        .exec(function(err, client_data) {
            if (err) {return next(err); }

            // Render form with existing client data
            res.render('forms/clientForm', { title: 'Client Input Form', client: client_data } );

        })

    }
    else {
        res.render('forms/clientForm', { title: 'Client Input Form' } );
    }
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
                _id:req.params.id, //This is required, or a new ID will be assigned!

                client_details: {
                    client_first_name: req.body.client_first_name,
                    client_last_name: req.body.client_last_name,
                    client_email: req.body.client_email,
                    client_phone: req.body.client_phone
                }
            }
        );

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
            // Data from form is valid. Save or Update the record.

            if (req.params.id===undefined){ // Create new document
                siteData.save( function(err, doc) {
                    if (err) { return next(err); }
                    // Successful  - go to business details form with id
                    console.log(doc._id);
                    res.redirect('/sitedata/business/' + doc._id);
                });
            }
            else {
                SiteData.findByIdAndUpdate(req.params.id, siteData, {upsert: true}, function (err) {
                    if (err) { return next(err); }
                        // Succesful - go to business form
                        res.redirect('/sitedata/business/' + req.params.id);
                    }
                );
            }
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
