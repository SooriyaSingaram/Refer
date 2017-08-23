/**
 * Inventroy Reports
 */
var InventoryReport = require('../models/purchaseorder'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();
//configure routes
router.route('/receivedByProductReport')
    .get(getReceivedByProductDetails)

router.route('/receivedByMenuReport')
    .get(getReceivedByMenuDetails)

router.route('/receivedByFilterProductReport')
    .get(getReceivedByProduct)

router.route('/receivedByFilterMenuReport')
    .get(getReceivedByMenuFilter)

//Get product Received by details for inventory report
function getReceivedByProductDetails(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    InventoryReport.aggregate({
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
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'productId': '$productDetail.productId',
                    'receivedDetails': '$productDetail.receivedDetails',
                    'year': {
                        $year: "$productDetail.receivedDetails.receivedDate"
                    },
                    'month': {
                        $month: "$productDetail.receivedDetails.receivedDate"
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
        }, {
            $lookup: {
                from: "employees",
                localField: "_id.receivedDetails.receivedId",
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

//Get menu Received by details for inventory report
function getReceivedByMenuDetails(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
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
                }]
            }
        }, {
            "$unwind": "$menuDetail.receivedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'itemId': '$menuDetail.itemId',
                    'receivedDetails': '$menuDetail.receivedDetails',
                    'year': {
                        $year: "$menuDetail.receivedDetails.receivedDate"
                    },
                    'month': {
                        $month: "$menuDetail.receivedDetails.receivedDate"
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
                localField: "_id.receivedDetails.receivedId",
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
//Datewise filter the data in product received by report
function getReceivedByProduct(req, res) {
    InventoryReport.aggregate({
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
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'productId': '$productDetail.productId',

                    'receivedDetails': '$productDetail.receivedDetails',
                    'year': {
                        $year: "$productDetail.receivedDetails.receivedDate"
                    },
                    'month': {
                        $month: "$productDetail.receivedDetails.receivedDate"
                    }

                }
            }
        }, {
            $match: {
                $and: [{
                        "_id.receivedDetails.receivedDate": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "_id.receivedDetails.receivedId": req.query.receivedId
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
        }, {
            $lookup: {
                from: "employees",
                localField: "_id.receivedDetails.receivedId",
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
//Filter the Received menu details 
function getReceivedByMenuFilter(req, res) {

    InventoryReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
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
                }]
            }
        }, {
            "$unwind": "$menuDetail.receivedDetails"
        },

        {
            $project: {
                _id: {
                    'purchaseOrderId': '$purchaseOrderId',
                    'branchId': '$branchId',
                    'franchise': "$franchise",
                    'itemId': '$menuDetail.itemId',
                    'year': {
                        $year: "$menuDetail.receivedDetails.receivedDate"
                    },
                    'month': {
                        $month: "$menuDetail.receivedDetails.receivedDate"
                    },
                    'receivedDetails': '$menuDetail.receivedDetails'
                }
            }
        }, {
            $match: {
                $and: [{
                        "_id.receivedDetails.receivedDate": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "_id.receivedDetails.receivedId": req.query.receivedId
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
                localField: "_id.receivedDetails.receivedId",
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