var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var Nationality = require("./nationality.js");
var Residential = require("./residential.js");
var requestType = require("./request-type.js");
var configurationSchema = baseSchema.extend({
    nationalities: [Nationality.schema],
    residentials: [Residential.schema],
    requestType: [requestType.schema],
});

module.exports = mongoose.model('configuration', configurationSchema);
module.exports.schema = configurationSchema;