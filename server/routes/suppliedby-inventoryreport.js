/**
 * Inventroy Reports
 */
var InventoryReport = require('../models/purchaseorder'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/InventorySuppliedReport')
    .get(getSuppliedReport)

router.route('/MenuSuppliedReport')
    .get(getSuppliedMenuReport)

router.route('/SuppliedByProductFilter')
    .get(getDatewiseSuppliedProduct)

router.route('/suppliedByMenuFilter')
    .get(getSuppliedByMenuFilter)

//Get supplied report details for product
function getSuppliedReport(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                },
                      {
                    status: 'Partially Supplied'
                },
                   {
                    status: 'Supplied'
                }]
            }
        }, {
            "$unwind": "$productDetail"
        }, {
            $match: {
                $or: [{
                    'productDetail.status': 'Received'
                }, {
                    'productDetail.status': 'Partially Received'
                },
                      {
                    status: 'Partially Supplied'
                },
                   {
                    status: 'Supplied'
                }]
            }
        }, {
            "$unwind": "$productDetail.suppliedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'productId': '$productDetail.productId',
                    'requestProductTo': '$requestProductTo',
                    'supplierId': '$productDetail.supplierId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'suppliedDetails': '$productDetail.suppliedDetails',
                    'year': {
                        $year: "$productDetail.suppliedDetails.suppliedDate"
                    },
                    'month': {
                        $month: "$productDetail.suppliedDetails.suppliedDate"
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
//Get the supplied details for menu
function getSuppliedMenuReport(req, res) {
    var filterDetail = ksHelper.getMonthDetails();

    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                },
                {
                    status: 'Partially Supplied'
                },
                   {
                    status: 'Supplied'
                }
                ]
            }
        }, {
            "$unwind": "$menuDetail"
        },

        {
            $match: {
                $or: [{
                    'menuDetail.status': 'Received'
                }, {
                    'menuDetail.status': 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$menuDetail.suppliedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'itemId': '$menuDetail.itemId',
                    'year': {
                        $year: "$menuDetail.suppliedDetails.suppliedDate"
                    },
                    'month': {
                        $month: "$menuDetail.suppliedDetails.suppliedDate"
                    },
                    'suppliedDetails': '$menuDetail.suppliedDetails'
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
            $lookup: {
                from: "menus",
                localField: "_id.itemId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        }, {
            $lookup: {
                from: "units",
                localField: "menu.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        }, {
            $lookup: {
                from: "employees",
                localField: "_id.suppliedDetails.suppliedId",
                foreignField: "employeeId",
                as: "employee"
            },
        }, {
            "$unwind": "$employee"
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
//Datewise filter the data in product supplied by report
function getDatewiseSuppliedProduct(req, res) {
    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                },
                      {
                    status: 'Partially Supplied'
                },
                   {
                    status: 'Supplied'
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
            "$unwind": "$productDetail.suppliedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'productId': '$productDetail.productId',
                    'requestProductTo': '$requestProductTo',
                    'supplierId': '$productDetail.supplierId',
                    'suppliedDetails': '$productDetail.suppliedDetails',
                    'year': {
                        $year: "$productDetail.suppliedDetails.suppliedDate"
                    },
                    'month': {
                        $month: "$productDetail.suppliedDetails.suppliedDate"
                    }
                }
            }
        }, {
            $match: {
                $and: [{
                        "_id.suppliedDetails.suppliedDate": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "_id.suppliedDetails.suppliedId": req.query.supplierId
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
//Filter the Supplied Menu Details
function getSuppliedByMenuFilter(req, res) {
    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                },
                      {
                    status: 'Partially Supplied'
                },
                   {
                    status: 'Supplied'
                }]
            }
        }, {
            "$unwind": "$menuDetail"
        },

        {
            $match: {
                $or: [{
                    'menuDetail.status': 'Received'
                }, {
                    'menuDetail.status': 'Partially Received'
                }, ]
            }
        }, {
            "$unwind": "$menuDetail.suppliedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'itemId': '$menuDetail.itemId',
                    'year': {
                        $year: "$menuDetail.suppliedDetails.suppliedDate"
                    },
                    'month': {
                        $month: "$menuDetail.suppliedDetails.suppliedDate"
                    },
                    'suppliedDetails': '$menuDetail.suppliedDetails'
                }
            }
        }, {
            $match: {
                $and: [{
                        "_id.suppliedDetails.suppliedDate": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "_id.suppliedDetails.suppliedId": req.query.supplierdId
                    }
                ]

            }
        }, {
            $lookup: {
                from: "menus",
                localField: "_id.itemId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        }, {
            $lookup: {
                from: "units",
                localField: "menu.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        }, {
            $lookup: {
                from: "employees",
                localField: "_id.suppliedDetails.suppliedId",
                foreignField: "employeeId",
                as: "employee"
            },
        }, {
            "$unwind": "$employee"
        },
        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}

module.exports = router;