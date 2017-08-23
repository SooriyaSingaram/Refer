/**
 * Supplier Router
 */
var Supplier = require('../models/supplier'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Suppliers')
    .get(getSuppliers)
    .post(addSupplier);

router.route('/Suppliers/:id')
    .put(updateSupplier)
    .get(getSupplierById)
    .delete(deleteSupplier);

//Get the All the Supplier Details
function getSuppliers(req, res) {
    Supplier.find({
        isActive: true
    }, function(err, suppliers) {
        if (err)
            res.send(err);

        res.json(suppliers);
    });
}
//Update the Supplier Details for Particular Id
function updateSupplier(req, res) {
    Supplier.findOne({
        _id: req.params.id
    }, function(err, supplier) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            supplier[prop] = req.body[prop];
        }

        // save supplier details
        supplier.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Supplier
function deleteSupplier(req, res) {
    Supplier.remove({
        _id: req.params.id
    }, function(err, supplier) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Supplier
function addSupplier(req, res) {
    var supplier = new Supplier(req.body);
    Supplier.count({}, function(err, count) {
        supplier.supplierId = ksHelper.getModelId('KS_S', count);
        supplier.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Supplier Added'
            });
        });
    })
}
// function addSupplier(req, res) {
//     var supplier = new Supplier(req.body);
//     Supplier.find({
//         email: supplier.email
//     }, function(err, supplier) {
//         if (supplier.length) {
// var responcemsg={"message":"Email Already exists","statuscode":"1111"};
//             res.send({
//                 message: responcemsg
//             });
//         } else {
//             var supplier = new Supplier(req.body);
//             Supplier.count({}, function(err, count) {
//                 supplier.supplierId = ksHelper.getModelId('KS_S', count);
//                 supplier.save(function(err) {

//                     if (err)
//                         res.send(err);
//                     res.send({
//                         message: 'Supplier Added'
//                     });
//                 });
//             })
//         }
//     })
// }
//Get the Supplier Details for Particular Id
function getSupplierById(req, res) {
    Supplier.findOne({
        _id: req.params.id
    }, function(err, supplier) {
        if (err)
            res.send(err);

        res.json(supplier);
    });
}

module.exports = router;