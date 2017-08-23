/**
 * Role Setup Router
 */
var RoleSetup = require('../models/roleSetup'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/RoleSetups')
    .get(getRoleSetups)
    .post(addRoleSetup);

router.route('/RoleSetups/:id')
    .put(updateRoleSetup)
    .get(getRoleSetupById)
    .delete(deleteRoleSetup);

//Get the All the RoleSetup Details 
function getRoleSetups(req, res) {
    RoleSetup.find({
        isActive: true
    }, function(err, roleSetups) {
        if (err)
            res.send(err);

        res.json(roleSetups);
    });
}
//Update the RoleSetup Details for Particular Id
function updateRoleSetup(req, res) {
    RoleSetup.findOne({
        _id: req.params.id
    }, function(err, roleSetup) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            roleSetup[prop] = req.body[prop];
        }

        // save roleSetup details
        roleSetup.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular RoleSetup
function deleteRoleSetup(req, res) {
    RoleSetup.remove({
        _id: req.params.id
    }, function(err, roleSetup) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New RoleSetup
function addRoleSetup(req, res) {
    var roleSetup = new RoleSetup(req.body);
    RoleSetup.count({}, function(err, count) {
        roleSetup.roleId = ksHelper.getModelId('KS_RS', count);
        roleSetup.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the RoleSetup Details for Particular Id
function getRoleSetupById(req, res) {
    RoleSetup.findOne({
        _id: req.params.id
    }, function(err, roleSetup) {
        if (err)
            res.send(err);

        res.json(roleSetup);
    });
}

module.exports = router;