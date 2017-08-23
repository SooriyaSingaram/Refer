/**
 * Category Router
 */
var Category = require('../models/category'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Categories')
    .get(getCategories)
    .post(addCategory);

router.route('/Categories/:id')
    .put(updateCategory)
    .get(getCategoryById)
    .delete(deleteCategory);

//Get the All the Category Details
function getCategories(req, res) {
    Category.find({
        isActive: true
    }, function(err, categories) {
        if (err)
            res.send(err);

        res.json(categories);
    });
}
//Update the Category Details for Particular Id
function updateCategory(req, res) {
    Category.findOne({
        _id: req.params.id
    }, function(err, category) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            category[prop] = req.body[prop];
        }

        // save category details
        category.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Category
function deleteCategory(req, res) {
    Category.remove({
        _id: req.params.id
    }, function(err, category) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Category
function addCategory(req, res) {
    var category = new Category(req.body);
    Category.count({}, function(err, count) {
        category.categoryId = ksHelper.getModelId('KS_C', count);
        category.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Category Details for Particular Id
function getCategoryById(req, res) {
    Category.findOne({
        _id: req.params.id
    }, function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
}

module.exports = router;