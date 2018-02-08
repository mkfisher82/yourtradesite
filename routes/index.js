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

/* GET welcome page. */
router.get('/welcome/:id', user_controller.user_welcome_get );

module.exports = router;
