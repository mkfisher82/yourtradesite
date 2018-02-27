var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var serviceFeatureSchema = new Schema(
    {
        title: {type: String, required: true, max: 100},
        body: {type: String, required: true, max: 256}
    }
);

// Export model
module.exports = mongoose.model('ServiceFeature', serviceFeatureSchema);
