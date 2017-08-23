/**
 * Labour Cost Router
 */
var Labourcost = require('../models/labourcost'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Labourcost')
    .get(getLabourcost)
    .post(addLabourcost);

router.route('/Labourcost/:id')
    .put(updateLabourcost)
    .get(getLabourcostById)
    .delete(deleteLabourcost);

//Get the All the Labourcost Details
function getLabourcost(req, res) {
    Labourcost.find({
        isActive: true
    }, function(err, labourcosts) {
        if (err)
            res.send(err);

        res.json(labourcosts);
    });
}
//Update the Labourcost Details for Particular Id
function updateLabourcost(req, res) {
    Labourcost.findOne({
        _id: req.params.id
    }, function(err, labourcosts) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            labourcosts[prop] = req.body[prop];
        }

        // save Labourcost details
        labourcosts.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'labourcosts updated!'
            });
        });

    });
}
//Delete the Particular Labourcost
function deleteLabourcost(req, res) {
    Labourcost.remove({
        _id: req.params.id
    }, function(err, labourcosts) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
}
//Create the New Labourcost
function addLabourcost(req, res) {
    var labourcost = new Labourcost(req.body);
    Labourcost.count({}, function(err, count) {
        labourcost.labourCostId = ksHelper.getModelId('KS_LB', count);
        labourcost.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'labourcost Added'
            });
        });
    })
}
//Get the Labourcost Details for Particular Id
function getLabourcostById(req, res) {
    Labourcost.findOne({
        _id: req.params.id
    }, function(err, labourcosts) {
        if (err)
            res.send(err);

        res.json(labourcosts);
    });
}

module.exports = router;