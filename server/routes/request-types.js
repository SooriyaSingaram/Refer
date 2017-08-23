/**
 * Request Type Router
 */
var RequestType = require('../models/request-type'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Requesttypes')
    .get(getRequestType)
    .post(addRequestType);

router.route('/Requesttypes/:id')
    .put(updateRequestType)
    .get(getRequestTypeById)
    .delete(deleteRequestType);

//Get the All the Requesttype Details
function getRequestType(req, res) {
    RequestType.find({
        isActive: true
    }, function(err, reqtypes) {
        if (err)
            res.send(err);

        res.json(reqtypes);
    });
}
//Update the RequestType Details for Particular Id
function updateRequestType(req, res) {
    RequestType.findOne({
        _id: req.params.id
    }, function(err, reqtype) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            reqtype[prop] = req.body[prop];
        }

        // save requestType details
        reqtype.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular RequestType
function deleteRequestType(req, res) {
    RequestType.remove({
        _id: req.params.id
    }, function(err, reqtype) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New RequestType
function addRequesttype(req, res) {
    var reqtype = new RequestType(req.body);
    RequestType.count({}, function(err, count) {
        reqtype.requestId = ksHelper.getModelId('KS_RT', count);
        reqtype.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the RequestType Details for Particular Id
function getRequestTypeById(req, res) {
    RequestType.findOne({
        _id: req.params.id
    }, function(err, reqtype) {
        if (err)
            res.send(err);

        res.json(reqtype);
    });
}

module.exports = router;