var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var subCategorySchema = baseSchema.extend({
    subCategoryName: {
        type: String
    },
    subCategoryId: {
        type: String
    },
    categoryId: {
        type: String
    }

});
module.exports = mongoose.model('subCategory', subCategorySchema);
module.exports.schema = subCategorySchema;