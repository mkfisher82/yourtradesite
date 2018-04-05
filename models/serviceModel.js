var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var serviceSchema = new Schema(
    {
        service: {type: String, required: true, max: 100},
        trade: [{type: String, required: true, max: 100}]
    }
);

// Export model
module.exports = mongoose.model('Service', serviceSchema);
