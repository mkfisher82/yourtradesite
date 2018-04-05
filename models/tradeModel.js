var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tradeSchema = new Schema(
    {
        name: {type: String, required: true, max: 100}
    }
);

// Export model
module.exports = mongoose.model('Trade', tradeSchema);
