/**
 * Invoice Router
 */
var Invoice = require('../models/invoice'),
    PurchaseOrder = require('../models/purchaseorder'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Invoices')
    .get(getInvoices)
    .post(addInvoice);

router.route('/Invoices/:id')
    .put(updateInvoice)
    .get(getInvoiceById)
    .delete(deleteInvoice);

//Get the All the Invoice Details
function getInvoices(req, res) {
    Invoice.find({
        isActive: true
    }, function(err, invoices) {
        if (err)
            res.send(err);

        res.json(invoices);
    });
}
//Update the Invoice Details for Particular Id
function updateInvoice(req, res) {
    Invoice.findOne({
        _id: req.params.id
    }, function(err, invoice) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            invoice[prop] = req.body[prop];
        }

        // save invoice details
        invoice.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Invoice
function deleteInvoice(req, res) {
    Invoice.remove({
        _id: req.params.id
    }, function(err, invoice) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Invoice
function addInvoice(req, res) {
    var invoice = new Invoice(req.body);
    Invoice.count({}, function(err, count) {
        invoice.invoiceId = ksHelper.getModelId('KS_I', count);
        invoice.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Invoice Details for Particular Id
function getInvoiceById(req, res) {
    Invoice.findOne({
        _id: req.params.id
    }, function(err, invoice) {
        if (err)
            res.send(err);

        res.json(invoice);
    });
}

module.exports = router;