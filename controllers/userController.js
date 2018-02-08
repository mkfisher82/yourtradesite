var User = require('../models/user');
var mongoose = require('mongoose');

// Display login page with user name
exports.user_login = function(req, res){

    var name = req.body.name;
    res.render('login', { name: name});
};
