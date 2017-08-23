/**
 * Complaint Type Router
 */
var ComplaintType = require('../models/complaint-type'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Complainttypes')
    .get(getComplaintType)
    .post(addComplaintType);

router.route('/Complainttypes/:id')
    .put(updateComplaintType)
    .get(getComplaintTypeById)
    .delete(deleteComplaintType);

//Get the All the ComplaintType Details
function getComplaintType(req, res) {
    ComplaintType.find({
        isActive: true
    }, function(err, complainttypes) {
        if (err)
            res.send(err);

        res.json(complainttypes);
    });
}
//Update the ComplaintType Details for Particular Id
function updateComplaintType(req, res) {
    ComplaintType.findOne({
        _id: req.params.id
    }, function(err, complainttype) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            complainttype[prop] = req.body[prop];
        }
        // save complainttype details
        complainttype.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular ComplaintType
function deleteComplaintType(req, res) {
    ComplaintType.remove({
        _id: req.params.id
    }, function(err, complainttype) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New ComplaintType
function addComplaintType(req, res) {
    var complainttype = new ComplaintType(req.body);
    ComplaintType.count({}, function(err, count) {
        complainttype.complaintId = ksHelper.getModelId('KS_CT', count);
        complainttype.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the ComplaintType Details for Particular Id
function getComplaintTypeById(req, res) {
    ComplaintType.findOne({
        _id: req.params.id
    }, function(err, complainttype) {
        if (err)
            res.send(err);

        res.json(complainttype);
    });
}

module.exports = router;