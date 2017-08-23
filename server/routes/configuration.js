/**
 * Configuration Router
 */
var Config = require('../models/configuration'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/configuration')
    .get(getConfigDetails)
    .post(addConfigDetails);

router.route('/configuration/:id')
    .put(updateConfigDetails)

//Get the All the Configuration Details  
function getConfigDetails(req, res) {
    Config.find({
        isActive: true
    }, function(err, config) {
        if (err)
            res.send(err);
        res.json(config);
    });
}
//Create the New Configuration
function addConfigDetails(req, res) {
    var config = new Config(req.body);
    Config.count({}, function(err, count) {
        config.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Update the Configuration Details for Particular Id
function updateConfigDetails(req, res) {
    Config.findOne({
        _id: req.params.id
    }, function(err, config) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            config[prop] = req.body[prop];
        }

        // save configuration details
        config.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}

module.exports = router;