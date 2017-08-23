var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var residentialSchema = baseSchema.extend({
    residentialId: {
        type: String
    },
    residentialName: {
        type: String
    }
});

module.exports = mongoose.model('Residential', residentialSchema);
module.exports.schema = residentialSchema;