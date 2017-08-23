var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var categorySchema = baseSchema.extend({
    categoryName: {
        type: String
    },
    categoryId: {
        type: String
    }
});

module.exports = mongoose.model('category', categorySchema);
module.exports.schema = categorySchema;