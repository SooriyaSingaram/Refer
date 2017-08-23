/**
 * Labour Cost Router
 */
var Overheadprice = require('../models/overheadprice'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Overheadprices')
    .get(getOverheadprice)
    .post(addOverheadprice);

router.route('/Overheadprices/:id')
    .put(updateOverheadprice)
    .get(getOverheadpriceById)
    .delete(deleteOverheadprice);

//Get the All the Overheadprice Details
function getOverheadprice(req, res) {
    Overheadprice.find({
        isActive: true
    }, function(err, overheadprices) {
        if (err)
            res.send(err);

        res.json(overheadprices);
    });
}
//Update the Overheadprice Details for Particular Id
function updateOverheadprice(req, res) {
    Overheadprice.findOne({
        _id: req.params.id
    }, function(err, overheadprices) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            overheadprices[prop] = req.body[prop];
        }

        // save Overheadprice details
        overheadprices.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'overheadprices updated!'
            });
        });

    });
}
//Delete the Particular Overheadprice
function deleteOverheadprice(req, res) {
    Overheadprice.remove({
        _id: req.params.id
    }, function(err, overheadprices) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
}
//Create the New Overheadprice
function addOverheadprice(req, res) {
    var overheadprices = new Overheadprice(req.body);
    Overheadprice.count({}, function(err, count) {
        overheadprices.overHeadPriceId = ksHelper.getModelId('KS_OH', count);
        overheadprices.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'overheadprices Added'
            });
        });
    })
}
//Get the Overheadprice Details for Particular Id
function getOverheadpriceById(req, res) {
    Overheadprice.findOne({
        _id: req.params.id
    }, function(err, overheadprices) {
        if (err)
            res.send(err);

        res.json(overheadprices);
    });
}

module.exports = router;