var SiteData = require('../models/siteDataModel');
var ServiceFeature = require('../models/serviceFeatureModel');
var mongoose = require('mongoose');
var fs = require('fs');

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

exports.publish_get = function(req, res, next) {
    console.log('Recieved a get request to publish');

    // Check for user id in req.params.id
    if (req.params.id) {
        // findById to get all site data for user
        SiteData.findById(req.params.id)
        .exec( function(err, result) {
            if (err) throw err;
            //Successful - write JSON data to file
            let data = JSON.stringify(result, null, 2);

            fs.writeFile('./locals/' + req.params.id + '.json', data, function(err) {
                if (err) throw err;

                console.log('Data written to file successfully');
            });
        });

    }
    else {
        console.log("No id in request")
        res.end();
    }
}

exports.why_use_us_get = function(req, res, next) {
    ServiceFeature.find({}, function(err, results) {
        if (err) throw err;
        console.log(results);
        res.render('forms/serviceFeaturesForm', {results: results});
    });
}

exports.why_use_us_post = function(req, res, next) {
    var serviceFeaturesTitleArray = [];
    var serviceFeaturesBodyArray = [];

    // get title and body of chosen features are store in array
    for (var i = 0; i < req.body.serviceFeatures.length; i++) {
        var value = req.body.serviceFeatures[i];
        var data = JSON.parse(value);
        serviceFeaturesTitleArray.push(data.title);
        serviceFeaturesBodyArray.push(data.body);
    }
    console.log(serviceFeaturesTitleArray);
    console.log(serviceFeaturesBodyArray);

    // add to user and save to db
    
    res.end(serviceFeaturesTitleArray[2]);
}
