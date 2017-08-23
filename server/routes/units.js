/**
 * Unit Router
 */
var Unit = require('../models/unit'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Units')
    .get(getUnits)
    .post(addUnit);
router.route('/Units/:id')
    .put(updateUnit)
    .get(getUnitById)
    .delete(deleteUnit);

//Get the All the Unit Details
function getUnits(req, res) {
    Unit.find({
        isActive: true
    }, function(err, units) {
        if (err)
            res.send(err);
        res.json(units);
    });
}
//Update the Unit Details for Particular Id
function updateUnit(req, res) {
    Unit.findOne({
        _id: req.params.id
    }, function(err, unit) {
        if (err)
            res.send(err);
        for (prop in req.body) {
            unit[prop] = req.body[prop];
        }
        // save unit details
        unit.save(function(err) {
            if (err)
                res.send(err);
            res.json({
                message: 'Successfully Done'
            });
        });
    });
}
//Delete the Particular Unit
function deleteUnit(req, res) {
    Unit.remove({
        _id: req.params.id
    }, function(err, unit) {
        if (err)
            res.send(err);
        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Unit
function addUnit(req, res) {
    var unit = new Unit(req.body);
    Unit.count({}, function(err, count) {
        unit.unitId = ksHelper.getModelId('KS_U', count);
        unit.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Unit Details for Particular Id
function getUnitById(req, res) {
    Unit.findOne({
        _id: req.params.id
    }, function(err, unit) {
        if (err)
            res.send(err);
        res.json(unit);
    });
}
module.exports = router;