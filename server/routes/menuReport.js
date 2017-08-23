/**
 * Mneu Report Router
 */
var MenuReport = require('../models/purchaseorder'),
    Menu = require('../models/menu'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

router.route('/MenuReport')
    .get(getMenuReport)

router.route('/MenuDetails')
    .get(getMenuDetails)

router.route('/topsoldmenu')
    .get(getTopSoldMenu)

//Get the menu report details 
function getMenuReport(req, res) {

    var filterDetail;
    if (req.query.month != undefined) {
        filterMenuReport(req, res);
    } else {
        filterDetail = ksHelper.getMonthDetails();
        getMonthlyMenu(req, res, filterDetail);
    }
}
//Filter the monthly menu Report Details
function filterMenuReport(req, res) {
    MenuReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$menuDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$menuDetail.deliveryDate"
                    },
                    year: {
                        $year: "$menuDetail.deliveryDate"
                    },
                    menuDetails: '$menuDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.menuDetails.status': 'Received'
                }, {
                    '_id.menuDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuDetails.itemId',
                   },
                receivedQty: {
                    $sum: "$_id.menuDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                'count': {
                    $sum: 1
                }
            },
        },

        {
            $match: {

                $and: [{
                    '_id.month': parseInt(req.query.month)
                }, {
                    '_id.year': parseInt(req.query.year)
                }]

            }
        }, {
            $lookup: {
                from: "menus",
                localField: "_id.menuId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        },

        {
            $lookup: {
                from: "menucategories",
                localField: "menu.menucategoryId",
                foreignField: "categoryId",
                as: "menucategory"
            },
        }, {
            "$unwind": "$menucategory"
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                'orderdedQty': -1
            }
        },

        function(err, menuReport) {
            if (err)
                res.send(err);
            res.json(menuReport);
        });
}
//Get the last 2 month menu details
function getMonthlyMenu(req, res, filterDetail) {
    MenuReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$menuDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$menuDetail.deliveryDate"
                    },
                    year: {
                        $year: "$menuDetail.deliveryDate"
                    },
                    menuDetails: '$menuDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.menuDetails.status': 'Received'
                }, {
                    '_id.menuDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuDetails.itemId',

                },
                receivedQty: {
                    $sum: "$_id.menuDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                'count': {
                    $sum: 1
                }
            },
        },

        {
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
                localField: "_id.menuId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        },

        {
            $lookup: {
                from: "menucategories",
                localField: "menu.menucategoryId",
                foreignField: "categoryId",
                as: "menucategory"
            },
        }, {
            "$unwind": "$menucategory"
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                'orderdedQty': -1
            }
        },

        function(err, menuReport) {
            if (err)
                res.send(err);
            res.json(menuReport);
        });
}

//Get monthly menu details
function getMenuDetails(req, res) {
    Menu.aggregate({
            $lookup: {
                from: "menucategories",
                localField: "menucategoryId",
                foreignField: "categoryId",
                as: "menucategories_collection"
            },
        }, {
            $unwind: "$menucategories_collection"
        },
        // {
        //     $lookup: {
        //         from: "employees",
        //         localField: "createdby",
        //         foreignField: "employeeId",
        //         as: "employee_collection"
        //     },
        // }, {
        //     $unwind: "$employee_collection"
        // },
        {
            $lookup: {
                from: "units",
                localField: "unitId",
                foreignField: "unitId",
                as: "units_collection"
            },
        }, {
            $unwind: "$units_collection"
        },
        function(err, menus) {
            if (err)
                res.send(err);

            res.json(menus);
        });
}
//Get top sold menu details and filter details
function getTopSoldMenu(req, res) {
    var filterDetail;
    if (req.query.month != undefined) {
        filteredTopMenu(req, res);
    } else {
        filterDetail = ksHelper.getMonthDetails();
        getTopMenu(req, res, filterDetail);
    }
}
//Get the Top Sold Menu Details
function getTopMenu(req, res, filterDetail) {
    // var filterDetail = ksHelper.dateValidation(req.query.year, req.query.month);
    var filterDetail = ksHelper.getMonthDetails();
    MenuReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$menuDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$menuDetail.deliveryDate"
                    },
                    year: {
                        $year: "$menuDetail.deliveryDate"
                    },
                    menuDetails: '$menuDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.menuDetails.status': 'Received'
                }, {
                    '_id.menuDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuDetails.itemId',

                },
                receivedQty: {
                    $sum: "$_id.menuDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                'count': {
                    $sum: 1
                }
            },
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
                localField: "_id.menuId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        },

        {
            $lookup: {
                from: "menucategories",
                localField: "menu.menucategoryId",
                foreignField: "categoryId",
                as: "menucategory"
            },
        }, {
            "$unwind": "$menucategory"
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                    orderdedQty: '$orderdedQty',
                    menuName: '$menu.itemName',
                    categoryName: '$menucategory.categoryName',
                    price: {
                        $multiply: ["$orderdedQty", "$menu.outletPrice"]
                    }

                }
            }
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                '_id.price': -1
            }
        },

        function(err, menuReport) {
            if (err)
                res.send(err);
            res.json(menuReport);
        });
}
//Filter the Top Sold Menu Details
function filteredTopMenu(req, res) {

    MenuReport.aggregate({
            $match: {
                $or: [{
                    status: 'Received'
                }, {
                    status: 'Partially Received'
                }]
            }
        }, {
            "$unwind": "$menuDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$menuDetail.deliveryDate"
                    },
                    year: {
                        $year: "$menuDetail.deliveryDate"
                    },
                    menuDetails: '$menuDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.menuDetails.status': 'Received'
                }, {
                    '_id.menuDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuDetails.itemId',

                },
                receivedQty: {
                    $sum: "$_id.menuDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                'count': {
                    $sum: 1
                }
            },
        }, {
            $match: {

                $and: [{
                    '_id.month': parseInt(req.query.month)
                }, {
                    '_id.year': parseInt(req.query.year)
                }]

            }
        }, {
            $lookup: {
                from: "menus",
                localField: "_id.menuId",
                foreignField: "menuId",
                as: "menu"
            },
        }, {
            "$unwind": "$menu"
        },

        {
            $lookup: {
                from: "menucategories",
                localField: "menu.menucategoryId",
                foreignField: "categoryId",
                as: "menucategory"
            },
        }, {
            "$unwind": "$menucategory"
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    menuId: '$_id.menuId',
                    orderdedQty: '$orderdedQty',
                    menuName: '$menu.itemName',
                    categoryName: '$menucategory.categoryName',
                    price: {
                        $multiply: ["$orderdedQty", "$menu.outletPrice"]
                    }

                }
            }
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                '_id.price': -1
            }
        },

        function(err, menuReport) {
            if (err)
                res.send(err);
            res.json(menuReport);
        });
}
module.exports = router;