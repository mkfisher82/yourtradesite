var express = require('express');
var router = express.Router();

// Require controller modules
var client_controller = require('../controllers/clientController');

// GET request to display client input form.
router.get('/', client_controller.client_form);

module.exports = router;
