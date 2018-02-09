var Client = require('../models/clientModel');
var mongoose = require('mongoose');

// express.validator modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.client_form = function(req, res, next) {

        res.render('clientDetails', { title: 'Input Client Data' } );

};
