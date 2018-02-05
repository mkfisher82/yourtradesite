var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  res.end("You have began your journey to a great website");
});

module.exports = router;
