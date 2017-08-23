/**
 * Menu Category Router
 */
var Menucategory = require('../models/menucategory'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Menucategories')
    .get(getMenuCategories)
    .post(addMenuCategory);

router.route('/Menucategories/:id')
    .put(updateMenuCategory)
    .get(getMenuCategoryById)
    .delete(deleteMenuCategory);

//Get the All the Menucategory Details
function getMenuCategories(req, res) {
    Menucategory.find({
        isActive: true
    }, function(err, menucategories) {
        if (err)
            res.send(err);

        res.json(menucategories);
    });
}
//Update the Menucategory Details for Particular Id
function updateMenuCategory(req, res) {
    Menucategory.findOne({
        _id: req.params.id
    }, function(err, menucategory) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            menucategory[prop] = req.body[prop];
        }

        // save menucategory details
        menucategory.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Menucategory
function deleteMenuCategory(req, res) {
    Menucategory.remove({
        _id: req.params.id
    }, function(err, menucategory) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Menucategory
function addMenuCategory(req, res) {
    var menucategory = new Menucategory(req.body);
    Menucategory.count({}, function(err, count) {
        menucategory.categoryId = ksHelper.getModelId('KS_MC', count);
        menucategory.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Menucategory Details for Particular Id
function getMenuCategoryById(req, res) {
    Menucategory.findOne({
        _id: req.params.id
    }, function(err, menucategory) {
        if (err)
            res.send(err);

        res.json(menucategory);
    });
}

module.exports = router;