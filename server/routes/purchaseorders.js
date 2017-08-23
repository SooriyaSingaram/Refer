/**
 * Purchase Router
 */
var PurchaseOrder = require('../models/purchaseorder'),
    Inventorysetting = require('../models/inventorysetting'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    Promise = require('promise'),
    _ = require('lodash'),
    router = express.Router(),
    Supplier = require('../models/supplier'),
    Employee = require('../models/employee'),
    emailer = require('../emailer/emailer');
 
//configure routes
router.route('/PurchaseOrders')
    .get(getPurchaseOrders)
    .post(addPurchaseOrders);

router.route('/PurchaseOrders/:id')
    .put(updatePurchaseOrder)
    .get(getPurchaseOrderById)
    .delete(deletePurchaseOrder);

router.route('/PurchaseOrdersDetails')
    .get(getDatewisePurchaseOrder)

router.route('/PurchaseOrderDetails/:id')
    .get(getPurchaseOrderByPOId)

router.route('/PurchaseOrdersPaymentReport')
    .get(getPurchaseOrderPaymentReport)

router.route('/PurchaseOrdersSellingReport')
    .get(getPurchaseOrderSellingReport)



//Get the All the PurchaseOrder Details 
function getPurchaseOrders(req, res) {
    PurchaseOrder.aggregate([{
            $lookup: {
                from: "employees",
                localField: "createdBy",
                foreignField: "employeeId",
                as: "employee_collection"
            }
        }, {
            $unwind: "$employee_collection"
        }, {
            $match: {
                isActive: true
            },
        },
        {
            $sort: {
                'createdDateTime': -1,
            }
        },
    ], function(err, purchaseOrder) {
        if (err)
            res.send(err);

        res.json(purchaseOrder);
    });
}

//Datewise get the Purchaseorder Details
function getDatewisePurchaseOrder(req, res) {
    PurchaseOrder.aggregate([{
        $match: {
            $and: [{
                    "createdDateTime": {
                        '$gte': new Date(req.query.fromDate),
                        '$lte': new Date(req.query.toDate)
                    }
                },
                {
                    'status': req.query.status
                }
            ]
        },
    }], function(err, purchaseOrder) {
        if (err)
            res.send(err);
        res.json(purchaseOrder);
    });
}

//Create the New PurchaseOrder
function addPurchaseOrders(req, res) {
    var purchaseOrder = new PurchaseOrder(req.body);
    PurchaseOrder.count({}, function(err, count) {
        purchaseOrder.purchaseOrderId = ksHelper.getModelId('KS_PO', count);
        purchaseOrder.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'PurchaseOrder added'
            });
        });
    })
 }
//getsupplierDetail function used get the detail supplier and send mail to respective supplier
function getSupplierDetails(productdetails) {
    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Supplier.findOne({
                supplierId: productdetails.supplierId
            }, function(err, suppliers) {
                handleSuccess(suppliers);
                var subject = "Purchase Order";
                var content = {
                    SupplierName: suppliers.supplierName,
                    SubjectContent: 'Please find the following order for below request',
                    rows: productdetails.productDetail,
                    purchaseordernumber :productdetails.purchaseOrderId
                }
                var receiver = [suppliers.email];
                var templateName = 'email';
                mailsent = emailer.sendEmailNotification(receiver, templateName, content, subject);
            })
        } catch (ex) {
            handleFailure(ex);
        }
    });
}
//getEmployeeDetails function used get the detail employee and send mail to respective employee
function getEmployeeDetails(purchaseOrder) {
    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Employee.findOne({
                employeeId: purchaseOrder.createdBy
            }, function(err, employees) {
                handleSuccess(employees);
                var subject = "Purchase Order";
                if (purchaseOrder.status === 'Ordered') {
                    var content = {
                        SupplierName: employees.employeeName,
                        SubjectContent: 'Please find the following order for below request Approved By Admin of Komalas',
                        rows: purchaseOrder.productDetail,
                        purchaseordernumber :purchaseOrder.purchaseOrderId
                    }
                } else {
                    var content = {
                        SupplierName: employees.employeeName,
                        SubjectContent: 'Please find the following order for below request Cancelled By Admin of Komalas',
                        rows: purchaseOrder.productDetail,
                        purchaseordernumber :purchaseOrder.purchaseOrderId
                    }
                }
                var receiver = [employees.userName];
                var templateName = 'email';
                mailsent = emailer.sendEmailNotification(receiver, templateName, content, subject);
            })
        } catch (ex) {
            handleFailure(ex);
        }
    });
}

//Get the purchaseOrder Details for Particular Id
function getPurchaseOrderById(req, res) {
    PurchaseOrder.findOne({
        _id: req.params.id
    }, function(err, purchaseOrder) {
        if (err)
            res.send(err);
        res.json(purchaseOrder);
    });
}

//Delete the purchaseOrder Details for Particular Id
function deletePurchaseOrder(req, res) {
    PurchaseOrder.remove({
        _id: req.params.id
    }, function(err, orders) {
        if (err)
            res.send(err);
        res.json({
            message: 'Successfully deleted'
        });
    });
}
//getPurchaseOrderByPOId function used get the detail purchase order and these use to genrate invoice
function getPurchaseOrderByPOId(req, res) {
    var newid = req.params.id;
    var urlId = newid.substring(newid.indexOf("_") + 1);

    if (urlId.charAt(0) === 'P') {
        PurchaseOrder.findOne({
            purchaseOrderId: req.params.id
        }, function(err, purchaseOrder) {
            if (err)
                res.send(err);
            res.json(purchaseOrder);
        });
    } else {
        PurchaseOrder.findOne({
            supplierId: req.params.id
        }, function(err, purchaseOrder) {
            if (err)
                res.send(err);
            res.json(purchaseOrder);
        });
    }

}
//upateInventoryProductQty function used update the avilableQuantity by finding branchId
function upateInventoryProductQty(branchId, qty, requestTo,status,res) {
    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Inventorysetting.findOne({
                inventoryId: branchId
            }, function(err, inventory) {
               updateProductQuantities(inventory.listOfProducts, qty, requestTo,status,res,handleSuccess);
                inventory.save(function(err) {
                    handleSuccess(true);
                });
            })
        } catch (ex) {
            handleFailure(ex);
        }
    });
}
//updateProductQuantities function used update the products by finding branchId
function updateProductQuantities(products, quantities, requestTo,status,res,handleSuccess) {
    console.log(status);
    var product;
    _.forEach(quantities, function(quantity) {
        product = _.find(products, {
            productId: quantity.productId
        })
        if (!product) {
            
            products.push({
                productId: quantity.productId,
                avilableQuantity: quantity.qty
            });
            console.log(products);
        } else {
            if (requestTo === 'Supplier') {
                product.avilableQuantity = product.avilableQuantity + quantity.qty;
            } else {
                if (product.avilableQuantity > quantity.qty) {
                    if(status === 'Supplied' || status === 'Partially Supplied'){
                    product.avilableQuantity = product.avilableQuantity - quantity.qty;
                    }
                        } else if (product.avilableQuantity < quantity.qty) {
                            res.send({message:'Products quantity are reached minimum inventory level please raise purchase order to respective supplier'
                     });
                     return handleSuccess(false);
                  }
            }
        }
    })
}
// getUpdationProducts function is used increment and decrement the inventory updations
function getUpdationProducts(productDetails, requestTo) {
    var updationProduct = [];
    _.forEach(productDetails, function(product) {
        var productInfo = {};
        productInfo["productId"] = product.productId;
        if (requestTo === 'Supplier') {
            productInfo["qty"] = product.receivedQty;
        } else {
            productInfo["qty"] = product.suppliedQty;
        }
        updationProduct.push(productInfo);
    })
    return updationProduct;
}
//Update the purchaseOrder Details for Particular Id
function updatePurchaseOrder(req, res) {
    PurchaseOrder.findOne({
        _id: req.params.id
    }, function(err, purchaseOrder) {
        var purchaseOrderDetail = req.body;
        for (prop in purchaseOrderDetail) {
            purchaseOrder[prop] = purchaseOrderDetail[prop];
        }
        if (purchaseOrderDetail.status == 'Ordered') {
           
            getSupplierDetails(purchaseOrderDetail);
            getEmployeeDetails(purchaseOrderDetail);
            purchaseOrder.save(function(err) {
                if (err)
                    res.send(err);
                res.send({
                    message: 'PurchaseOrder updated!'
                });
            });
        } else if (purchaseOrderDetail.status == 'Cancelled') {
          
            getEmployeeDetails(purchaseOrderDetail);
            purchaseOrder.save(function(err) {
                if (err)
                    res.send(err);
                res.send({
                    message: 'PurchaseOrder updated!'
                });
            });
        } else {
    
            var qtyToBeDeducted = getUpdationProducts(purchaseOrderDetail.productDetail, purchaseOrderDetail.requestProductTo,purchaseOrderDetail.status);
            upateInventoryProductQty(purchaseOrderDetail.wareHouseId, qtyToBeDeducted, purchaseOrderDetail.requestProductTo,purchaseOrderDetail.status,res)
                .then(function(data) {
                    if (data) {
                        purchaseOrder.save(function(err) {
                            if (err)
                                res.send(err);
                            res.send({
                                message: 'PurchaseOrder updated!'
                            });
                        });
                    }
                })
        }
    });
}

//Get purchase order Payment Details
function getPurchaseOrderSellingReport(req, res) {
    var filterDetail;
    if (req.query.fromDate != undefined) {
        getFilteredPOSellingDetails(req, res);
    } else {

        filterDetail = ksHelper.getMonthDetails();
        getPOSellingDetails(req, res, filterDetail);
    }
}
//Datewise filter the data in product received by report
function getFilteredPOSellingDetails(req, res) {
    PurchaseOrder.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$productDetail"
        },

        {
            $match: {
                $or: [{
                    'productDetail.status': 'Received'
                }, {
                    'productDetail.status': 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$productDetail.receivedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'productId': '$productDetail.productId',
                    'unitId': '$productDetail.unitId',
                      'receivedQty': {
                    $sum: "$productDetail.receivedDetails.receivedQty"
                },
              'date':"$createdDateTime",
                    'year': {
                        $year: "$createdDateTime"
                    },
                    'month': {
                        $month: "$createdDateTime"
                    }

                },
                'branchId': '$branchId',
                'franchise': '$franchise'
            }
        },  {
            $match: {
                $and: [{
                        "_id.date": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "_id.productId": req.query.productId
                    }
                ]

            }
        }, {
            $lookup: {
                from: "products",
                localField: "_id.productId",
                foreignField: "productId",
                as: "product"
            },
        }, {
            "$unwind": "$product"
        }, {
            $lookup: {
                from: "categories",
                localField: "product.categoryId",
                foreignField: "categoryId",
                as: "category"
            },
        }, {
            "$unwind": "$category"
        }, {
            $lookup: {
                from: "subcategories",
                localField: "product.subCategoryId",
                foreignField: "subCategoryId",
                as: "subCategory",
            },
        }, {
            "$unwind": "$subCategory"
        }, {
            $lookup: {
                from: "units",
                localField: "product.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}


function getPOSellingDetails(req, res, filterDetail) {

    PurchaseOrder.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$productDetail"
        },

        {
            $match: {
                $or: [{
                    'productDetail.status': 'Received'
                }, {
                    'productDetail.status': 'Partially Received'
                }]
            }
        }, 
        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'productId': '$productDetail.productId',
                    'unitId': '$productDetail.unitId',
                       'date':"$createdDateTime",
                      'receivedQty': {
                    $sum: "$productDetail.receivedDetails.receivedQty"
                },

                    'year': {
                        $year: "$createdDateTime"
                    },
                    'month': {
                        $month: "$createdDateTime"
                    }

                },
                'branchId': '$branchId',
                'franchise': '$franchise'
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
            $lookup: {
                from: "products",
                localField: "_id.productId",
                foreignField: "productId",
                as: "product"
            },
        }, {
            "$unwind": "$product"
        }, {
            $lookup: {
                from: "categories",
                localField: "product.categoryId",
                foreignField: "categoryId",
                as: "category"
            },
        }, {
            "$unwind": "$category"
        }, {
            $lookup: {
                from: "subcategories",
                localField: "product.subCategoryId",
                foreignField: "subCategoryId",
                as: "subCategory",
            },
        }, {
            "$unwind": "$subCategory"
        }, {
            $lookup: {
                from: "units",
                localField: "product.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}

//Get purchase order Payment Details
function getPurchaseOrderPaymentReport(req, res) {
    var filterDetail;
    if (req.query.fromDate != undefined) {
        getFilteredPOPaymentDetails(req, res);
    } else {
        filterDetail = ksHelper.getMonthDetails();
        getPOPayementDetails(req, res, filterDetail);
    }
}
//Get purchase order Payment Details filter by status
function getFilteredPOPaymentDetails(req, res) {
    PurchaseOrder.aggregate({
            $match: {
                $and: [{
                    $or: [{
                        'status': 'Received'
                    }, {
                        'status': 'Partially Received'
                    }]
                }]
            }
        }, {
            $lookup: {
                from: "invoices",
                localField: "purchaseOrderId",
                foreignField: "purchaseOrderId",
                as: "invoice"
            },
        }, {
            "$unwind": "$invoice"
        }, {
            $match: {
                $or: [{
                    'invoice.status': 'Partially Paid'
                }, {
                    'invoice.status': 'Paid'
                }]
            }
        }, {
            "$unwind": "$invoice.payments"
        }, {
            $project: {
                _id: {
                    'purchaseOrderId': '$invoice.purchaseOrderId',

                    'franchise': "$invoice.franchise",
                    'subTotal': '$invoice.subTotal',
                    'paymentDetails': '$invoice.payments',
                    'year': {
                        $year: "$invoice.createdDateTime"
                    },
                    'month': {
                        $month: "$invoice.createdDateTime"
                    }
                },
                'branchId': '$invoice.branchId',
            }
        }, {
            $match: {
                $and: [{
                    "_id.paymentDetails.date": {
                        '$gte': new Date(req.query.fromDate),
                        '$lte': new Date(req.query.toDate)
                    }
                }]
            }
        }, {
            $sort: {
                '_id.paymentDetails.date': -1,
            }
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
//Get purchase order Payment Details filter by status
function getPOPayementDetails(req, res, filterDetail) {
    PurchaseOrder.aggregate({
            $match: {
                $and: [{
                    $or: [{
                        'status': 'Received'
                    }, {
                        'status': 'Partially Received'
                    }]
                }]
            }
        }, {
            $lookup: {
                from: "invoices",
                localField: "purchaseOrderId",
                foreignField: "purchaseOrderId",
                as: "invoice"
            },
        }, {
            "$unwind": "$invoice"
        }, {
            $match: {
                $or: [{
                    'invoice.status': 'Partially Paid'
                }, {
                    'invoice.status': 'Paid'
                }]
            }
        }, {
            $project: {
                _id: {
                    'purchaseOrderId': '$invoice.purchaseOrderId',
                    'franchise': "$invoice.franchise",
                    'subTotal': '$invoice.subTotal',
                    'paymentDetails': '$invoice.payments',
                    'year': {
                        $year: "$invoice.createdDateTime"
                    },
                    'month': {
                        $month: "$invoice.createdDateTime"
                    }
                },
                'branchId': '$invoice.branchId',
            }
        }, {
            $match: {
                $or: [{
                        $and: [{
                            '_id.month': parseInt(filterDetail.fromMonth)
                        }, {
                            '_id.year': parseInt(filterDetail.fromYear)
                        }]
                    },
                    {
                        $and: [{
                            '_id.month': parseInt(filterDetail.toMonth)
                        }, {
                            '_id.year': parseInt(filterDetail.toYear)
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$_id.paymentDetails"
        },

        {
            $sort: {
                '_id.paymentDetails.date': -1,
            }
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
module.exports = router;