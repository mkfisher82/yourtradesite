var express = require('express');
var router = express.Router();

// Require controller modules
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', user_controller.user_login );

/* GET login page. */
router.get('/welcome', function(req, res, next) {
  res.render('welcome', { name: 'GET' });
});;

module.exports = router;
