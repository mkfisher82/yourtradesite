var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema for data
var SiteDataSchema = new Schema(
    {
        client_details: {
            client_first_name: {type: String, required: true, max: 100},
            client_last_name: {type: String, required: true, max: 100},
            client_email: {type: String, required: true, max: 20},
            client_phone: {type: String, required: true, min:10, max: 11}

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
                street: {type: String, required: true},
                suburb: {type: String, required: true, max: 20},
                city: {type: String, required: true, max: 20}
            },
            contact_email: {type: String, required: true, max: 20},
            contact_phone: {type: String, required: true, min: 10, max: 11}
        },

        service_features: {
            // preamble: {type: String, required: true},
            title: {type: Array, required: true},
            body: {type: Array, required: true}
        },

        github: {
            id: String,
            token: String,
            displayName: String,
            email: String
        },

        facebook: {
            id: String,
            token: String,
            displayName: String,
            email: String
        }

    }
);

// Virtual for client URL
SiteDataSchema
.virtual('url')
.get(function() {
    return '/summary/' + this._id;
});

// Virtual for client name
SiteDataSchema
.virtual('client_name')
.get( function() {
    return this.client_details.client_first_name + ' ' + this.client_details.client__last_name;
});


// Export model
module.exports = mongoose.model('SiteData', SiteDataSchema);
