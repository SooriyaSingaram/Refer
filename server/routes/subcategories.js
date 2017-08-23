/**
 * Sub Category Router
 */
var SubCategory = require('../models/subCategory'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/SubCategories')
    .get(getSubCategories)
    .post(addSubCategory);

router.route('/SubCategories/:id')
    .put(updateSubCategory)
    .get(getSubCategoryById)
    .delete(deleteSubCategory);

//Get the All the  Sub Category Details
function getSubCategories(req, res) {
    SubCategory.aggregate([{
        $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "categoryId",
            as: "categories_collection"
        }
    }, {
        $unwind: "$categories_collection"
    }, {
        $match: {
            isActive: true
        },
    }], function(err, categories) {
        if (err)
            res.send(err);

        res.json(categories);
    });
}
//Update the SubCategory Details for Particular Id
function updateSubCategory(req, res) {
    SubCategory.findOne({
        _id: req.params.id
    }, function(err, subCategory) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            subCategory[prop] = req.body[prop];
        }

        // save subCategory details
        subCategory.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular SubCategory
function deleteSubCategory(req, res) {
    SubCategory.remove({
        _id: req.params.id
    }, function(err, subCategory) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New SubCategory
function addSubCategory(req, res) {
    var subCategory = new SubCategory(req.body);
    SubCategory.count({}, function(err, count) {
        subCategory.subCategoryId = ksHelper.getModelId('KS_SC', count);
        subCategory.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the SubCategory Details for Particular Id
function getSubCategoryById(req, res) {
    SubCategory.findOne({
        _id: req.params.id
    }, function(err, subCategory) {
        if (err)
            res.send(err);

        res.json(subCategory);
    });
}

module.exports = router;