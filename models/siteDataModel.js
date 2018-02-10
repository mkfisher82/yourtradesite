var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema for client details
var clientDetailsSchema = new Schema(
    {
        client_first_name: {type: String, required: true, max: 100},
        client_last_name: {type: String, required: true, max: 100},
        client_email: {type: String, required: true, max: 20},
        client_phone: {type: String, required: true, min:10, max: 11}

    }
);

// Schema for business details
var businessDetailsSchema = new Schema(
    {
        business_name: {type: String, required: true, max: 100},
        business_slogan: {type: String, required: true, max: 255},
        owner_first_name: {type: String, required: true, max: 100},
        owner_last_name: {type: String, required: true, max: 100},
        trade: {type: String, required: true, max: 20},
        years_in_trade: {type: Number, required: true, min: 1}

    }
);

// Schema for business contact details
var addressSchema = new Schema(
    {
        street: {type: Number, required: true},
        suburb: {type: String, required: true, max: 20},
        city: {type: String, required: true, max: 20}
    }
);

var contactDetailsSchema = new Schema(
    {
        address: addressSchema,
        contact_email: {type: String, required: true, max: 20},
        contact_phone: {type: String, required: true, min: 10, max: 11}
    }
);

// Schema for website data
var SiteDataSchema = new Schema(
    {
        client_details: clientDetailsSchema,

        business_details: businessDetailsSchema,

        contact_details: contactDetailsSchema

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
