var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: {type: String, required: true, max: 100}
    }
);

// Virtual for user URL
UserSchema
.virtual('url')
.get(function() {
    return '/user/' + this._id;
});

// Export model
module.exports = mongoose.model('User', UserSchema);
