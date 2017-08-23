/**
 * Franchise Branch Router
 */
var FranchiseBranch = require('../models/franchisebranch');
express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/FranchiseBranchs')
    .get(getFranchiseBranch)
    .post(addFranchiseBranch);

router.route('/FranchiseBranchs/:id')
    .put(updateFranchiseBranch)
    .get(getFranchiseBranchById)
    .delete(deleteFranchiseBranch);

//Get the All the FranchiseBranch Details  
function getFranchiseBranch(req, res) {
    FranchiseBranch.aggregate({
        $lookup: {
            from: "outlets",
            localField: "franchiseId",
            foreignField: "branchId",
            as: "franchiseDetails"
        },
    }, {
        $unwind: "$franchiseDetails"
    }, {
        $match: {
            isActive: true
        }
    }, function(err, franchisebranchs) {
        if (err)
            res.send(err);
        res.json(franchisebranchs);
    });
}
//Create the New FranchiseBranch
function addFranchiseBranch(req, res) {
    var franchisebranch = new FranchiseBranch(req.body);
    FranchiseBranch.count({}, function(err, count) {
        franchisebranch.branchId = ksHelper.getModelId("KS_Fb", count);
        franchisebranch.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Update the FranchiseBranch Details for Particular Id
function updateFranchiseBranch(req, res) {
    FranchiseBranch.findOne({
            _id: req.params.id
        },
        function(err, franchisebranch) {
            if (err)
                res.send(err);

            for (prop in req.body) {
                franchisebranch[prop] = req.body[prop];
            }

            // save franchisebranch details
            franchisebranch.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Successfully Done'
                });
            });

        });
}
//Get the FranchiseBranch Details for Particular Id
function getFranchiseBranchById(req, res) {
    FranchiseBranch.findOne({
            _id: req.params.id
        },
        function(err, franchisebranch) {
            if (err)
                res.send(err);
            res.json(franchisebranch);
        });
}
//Delete the Particular FranchiseBranch
function deleteFranchiseBranch(req, res) {

    FranchiseBranch.remove({
        _id: req.params.id
    }, function(err, franchisebranch) {
        if (err)
            res.send(err);
        res.json({
            message: 'Successfully Done'
        });
    });

}

module.exports = router;