var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST login page. */
router.post('/login', user_controller.user_login);

module.exports = router;
