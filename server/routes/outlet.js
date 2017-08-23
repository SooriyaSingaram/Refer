/**
 * Outlet Router
 */
var Outlet = require('../models/outlet'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Outlets')
    .get(getOutlets)
    .post(addOutlet);

router.route('/Outlets/:id')
    .put(updateOutlet)
    .get(getOutletById)
    .delete(deleteOutlet);

//Get the All the Outlet Details
function getOutlets(req, res) {
    Outlet.find({
        isActive: true
    }, function(err, outlets) {
        if (err)
            res.send(err);

        res.json(outlets);
    });
}

//Update the Outlet Details for Particular Id
function updateOutlet(req, res) {
    Outlet.findOne({
        _id: req.params.id
    }, function(err, outlet) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            outlet[prop] = req.body[prop];
        }

        // save outlet details
        outlet.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Outlet
function deleteOutlet(req, res) {
    Outlet.remove({
        _id: req.params.id
    }, function(err, outlet) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Outlet
function addOutlet(req, res) {
    var outlet = new Outlet(req.body);
    Outlet.count({}, function(err, count) {
        outlet.branchId = ksHelper.getModelId('KS_B', count);
        outlet.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Outlet Details for Particular Id
function getOutletById(req, res) {
    Outlet.findOne({
        _id: req.params.id
    }, function(err, outlet) {
        if (err)
            res.send(err);
        res.json(outlet);
    });
}

module.exports = router;