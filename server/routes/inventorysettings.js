/**
 * Inventory Setting Router
 */
var Inventorysetting = require('../models/inventorysetting');
    express = require('express'),
    ksHelper = require('../helper/ksHelper');
    router = express.Router();

//configure routes
router.route('/Inventorysettings')
    .get(getInventory)
    .post(addInventory);

router.route('/Inventorysettings/:id')
    .put(updateInventory)
    .get(getInventoryById)
    .delete(deleteInventory);

//Get the All the Inventory Details
function getInventory(req, res) {
    Inventorysetting.aggregate({
            $lookup: {
                from: "units",
                localField: "listOfProducts.unitId",
                foreignField: "unitId",
                as: "unitDetail"
            },
          
        }, {
            $match: {
                isActive: true
            }
        },
        function(err, inventorysetting) {
            if (err)
                res.send(err);
            res.json(inventorysetting);
        });
};
//Create the New Inventory
function addInventory(req, res) {
      var inventorysetting=new Inventorysetting(req.body);
        Inventorysetting.count({}, function(err,count) {
        inventorysetting.inventoryId = ksHelper.getModelId('KS_IN', count);
       inventorysetting.save(function(err){

        if (err)
            res.send(err);

        res.send({
            message: 'Successfully Done'
        });
    });
        });

}
//Update the Inventory Details for Particular Id
function updateInventory(req, res) {

    Inventorysetting.findOne({
        _id: req.params.id
    }, function(err, inventorysetting) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            inventorysetting[prop] = req.body[prop];
        }
        // save inventory details
        inventorysetting.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Get the Inventory Details for Particular Id
function getInventoryById(req, res) {
    Inventorysetting.findOne({
        _id: req.params.id
    }, function(err, inventorysetting) {
        if (err)
            res.send(err);

        res.json(inventorysetting);
    });
}
//Delete the Particular Inventory
function deleteInventory(req, res) {
    Inventorysetting.remove({
        _id: req.params.id
    }, function(err, addinventorysetting) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}

router.route('/inventorybranch/:id')

.get(function(req, res) {
    Inventorysetting.findOne({
        BranchId: req.params.id
    }, function(err, inventorysetting) {
        if (err)
            res.send(err);

        res.json(inventorysetting);
    });
})

module.exports = router;