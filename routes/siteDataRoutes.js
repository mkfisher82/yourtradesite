var express = require('express');
var router = express.Router();

// Require controller modules
var site_data_controller = require('../controllers/siteDataController');

router.get('/', function(req, res){
    res.send('Basic sitedata page');
});

// GET request to display new  client details input form.
router.get('/client', site_data_controller.client_form_get);

// POST request for new client details input form.
router.post('/client', site_data_controller.client_form_post);

// GET request to display returning client details input form.
router.get('/client/:id', site_data_controller.client_form_get);

// POST request for returning client details input form.
router.post('/client/:id', site_data_controller.client_form_post);

// GET request to display business details input form.
router.get('/business/:id', site_data_controller.business_form_get);

// POST request for business details input form.
router.post('/business/:id', site_data_controller.business_form_post);

// GET request to display contact details input form.
router.get('/contact/:id', site_data_controller.contact_form_get);

// POST request for contact details input form.
router.post('/contact/:id', site_data_controller.contact_form_post);

module.exports = router;
