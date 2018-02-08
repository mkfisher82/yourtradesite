var User = require('../models/user');
var mongoose = require('mongoose');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Validate, sanitize and save name
exports.user_login = [

    // Validate that the name field is not empty.
    body('name', 'Name must be 3 or more letters. Please re-enter your name').isLength({ min: 3}).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    //Process request after validation and sanitization
    function (req, res, next) {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data
        var user = new User(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are Errors. Render the form again with sanitized values/errors messages.
            res.render('index', { title: 'Welcome to YTS', user: user, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            User.findOne({ 'name': req.body.name })
            .exec( function (err, found_name) {
                if (err) { return next(err); }

                if (found_name) {
                    // Name exists, go to login page
                    res.redirect('/welcome');
                }
                else {
                    user.save(function (err) {
                        if (err) { return next(err); }
                        // User saved. Redirect to welcome page.
                        res.redirect('/welcome');
                    });
                }
            });
        }
    }
];
