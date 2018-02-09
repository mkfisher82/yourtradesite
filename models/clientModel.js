var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
    {
        client_details: {
            client_first_name: {type: String, required: true, max: 100},
            client_last_name: {type: String, required: true, max: 100},
            client_email: {type: String, required: true, max: 20},
            client_phone: {type: Number, required: true, max: 10}
        },

        business_details: {
            business_name: {type: String, required: true, max: 100},
            business_slogan: {type: String, required: true, max: 255},
            owner_first_name: {type: String, required: true, max: 100},
            owner_last_name: {type: String, required: true, max: 100},
            trade: {type: String, required: true, max: 20},
            years_in_trade: {type: Number, required: true, min: 1}
        },

        contact_details: {
            address: {
                street: {type: Number, required: true},
                suburb: {type: String, required: true, max: 20},
                city: {type: String, required: true, max: 20}
            },
            business_email: {type: String, required: true, max: 20},
            business_phone: {type: Number, required: true, max: 10}
        }
    }
);

// Virtual for client URL
ClientSchema
.virtual('url')
.get(function() {
    return '/client/' + this._id;
});

// Virtual for client name
ClientSchema
.virtual('client_name')
.get( function() {
    return this.client_details.client_first_name + ' ' + this.client_details.client__last_name;
});


// Export model
module.exports = mongoose.model('Client', ClientSchema);
