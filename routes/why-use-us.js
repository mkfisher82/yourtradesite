var express = require('express');
var router = express.Router();

// Require controller modules
var site_data_controller = require('../controllers/siteDataController');

router.get('/', function(req, res){
    res.send('This section tells the customer what makes your business great');
});

/* GET service-feature */
router.get('/features', site_data_controller.why_use_us_get);

/* POST service-feature */
router.post('/features', site_data_controller.why_use_us_post);

module.exports = router;
