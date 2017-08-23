/**
 * Request Router
 */
var Request = require('../models/request'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Requests')
    .get(getRequest)
    .post(addRequest);
router.route('/Requests/:id')
    .put(updateRequest)
    .get(getRequestById)
    .delete(deleteRequest);

//Get the All the Request Details
function getRequest(req, res) {
    Request.aggregate({

            $lookup: {
                from: "employees",
                localField: "raisedBy",
                foreignField: "employeeId",
                as: "employees_collection"
            },
        }, {
            $unwind: "$employees_collection"
        },{

            $lookup: {
                from: "outlets",
                localField: "outletId",
                foreignField: "branchId",
                as: "outlet_collection"
            },
        }, {
            $unwind: "$outlet_collection"
        },{
            $match: {
                isActive: true
            }
        }, function(err, requests) {
        if (err)
            res.send(err);

        res.json(requests);
    });
}
//Update the Request Details for Particular Id
function updateRequest(req, res) {
    Request.findOne({
        _id: req.params.id
    }, function(err, request) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            request[prop] = req.body[prop];
        }
        // save request details
        request.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Request
function deleteRequest(req, res) {
    Request.remove({
        _id: req.params.id
    }, function(err, request) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Request
function addRequest(req, res) {
    var request = new Request(req.body);
    Request.count({}, function(err, count) {
        request.reqId = ksHelper.getModelId('KS_R', count);
        request.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Request Details for Particular Id
function getRequestById(req, res) {
    Request.findOne({
        _id: req.params.id
    }, function(err, request) {
        if (err)
            res.send(err);

        res.json(request);
    });
}

module.exports = router;