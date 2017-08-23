/**
 * Supplier Report Router
 */
var Invoice = require('../models/invoice'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();
    
//configure route
router.route('/SupplierReport')
    .get(getSupplierReport)

router.route('/SupplierFilterReport')
    .get(getSupplierFilterReport)

//Get Supplier Report Details based on PurchaseOrder Colloction
function getSupplierReport(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    Invoice.aggregate({
            $match: {
                $or: [{
                    'status': 'Partially Paid'
                }, {
                    'status': 'Paid'
                }]
            }
        }, {
            $project: {
                _id: {
                    'invoiceId': '$invoiceId',
                   'purchaseOrderId': '$invoiceNo',
                    'supplierId': '$supplierId',
                    'subTotal': '$subTotal',
                    'payments': '$payments',
                    'year': {
                        $year: "$createdDateTime"
                    },
                    'month': {
                        $month: "$createdDateTime"
                    }
                }
            }
        }, {
            $match: {
                $or: [{
                        $and: [{
                            '_id.month': filterDetail.fromMonth
                        }, {
                            '_id.year': parseInt(filterDetail.fromYear)
                        }]
                    },
                    {
                        $and: [{
                            '_id.month': filterDetail.toMonth
                        }, {
                            '_id.year': parseInt(filterDetail.toYear)
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$_id.payments"
        }, {
            $group: {
                _id: {
                    invoiceId: '$_id.invoiceId',
                    purchaseOrderId: '$_id.purchaseOrderId',
                    supplierId: '$_id.supplierId',
                    subTotal: '$_id.subTotal',
                    month: '$_id.month',
                    year: '$_id.year'
                },
                paidAmount: {
                    $sum: "$_id.payments.paidAmount"
                }
            },
        }, {
            $lookup: {
                from: "suppliers",
                localField: "_id.supplierId",
                foreignField: "supplierId",
                as: "supplier"
            },
        }, {
            "$unwind": "$supplier"
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });

}
// Get Supplier Report based on Month and Year 
function getSupplierFilterReport(req, res) {
    Invoice.aggregate({
            $match: {
                $or: [{
                    'status': 'Partially Paid'
                }, {
                    'status': 'Paid'
                }]
            }
        }, {
            $project: {
                _id: {
                    'invoiceId': '$invoiceId',
                    'purchaseOrderId': '$purchaseOrderId',
                    'supplierId': '$supplierId',
                    'subTotal': '$subTotal',
                    'payments': '$payments',
                    'year': {
                        $year: "$createdDateTime"
                    },
                    'month': {
                        $month: "$createdDateTime"
                    }
                }
            }
        }, {
            $match: {

                $and: [{
                    '_id.month': parseInt(req.query.month)
                }, {
                    '_id.year': parseInt(req.query.year)
                }, {
                    '_id.supplierId': req.query.supplierId
                }]
            }
        }, {
            "$unwind": "$_id.payments"
        }, {
            $group: {
                _id: {
                    invoiceId: '$_id.invoiceId',
                    purchaseOrderId: '$_id.purchaseOrderId',
                    supplierId: '$_id.supplierId',
                    subTotal: '$_id.subTotal',
                    month: '$_id.month',
                    year: '$_id.year'
                },
                paidAmount: {
                    $sum: "$_id.payments.paidAmount"
                }
            },
        }, {
            $lookup: {
                from: "suppliers",
                localField: "_id.supplierId",
                foreignField: "supplierId",
                as: "supplier"
            },
        }, {
            "$unwind": "$supplier"
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });

}
module.exports = router;