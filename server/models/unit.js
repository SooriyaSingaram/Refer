var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var unitSchema = baseSchema.extend({
    unitId: {
        type: String
    },
    unitName: {
        type: String
    }
});
module.exports = mongoose.model('Unit', unitSchema);
module.exports.schema = unitSchema;