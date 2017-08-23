/**
 * Product Report Router
 */
var ProductReport = require('../models/purchaseorder'),
    Product = require('../models/product'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

router.route('/ProductReport')
    .get(getProductReport)

router.route('/ExpiryProduct')
    .get(getExpiryProduct)

router.route('/topsoldProduct')
    .get(getTopSoldProduct)

//Get the product Details
function getProductReport(req, res) {
    var filterDetail;
    if (req.query.month != undefined) {
        getFilterProduct(req, res);
    } else {
        filterDetail = ksHelper.getMonthDetails();
        getProduct(req, res, filterDetail);
    }

}
//Filter the Monthly product Report Details
function getFilterProduct(req, res) {
    ProductReport.aggregate({
            $match: {
                $and: [{
                        $or: [{
                            menuItem: false
                        }, {
                            requestProductTo: 'Ware House'
                        }]
                    },
                    {
                        $or: [{
                            status: 'Received'
                        }, {
                            status: 'Partially Received'
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$productDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$createdDateTime"
                    },
                    year: {
                        $year: "$createdDateTime"
                    },
                    productDetails: '$productDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.productDetails.status': 'Received'
                }, {
                    '_id.productDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productDetails.productId',

                },
                receivedQty: {
                    $sum: "$_id.productDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
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
                from: "products",
                localField: "_id.productId",
                foreignField: "productId",
                as: "product"
            },
        }, {
            "$unwind": "$product"
        },

        {
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
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                'orderdedQty': -1
            }
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
//Get the montly product report details
function getProduct(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    ProductReport.aggregate({
            $match: {
                $and: [{
                        $or: [{
                            menuItem: false
                        }, {
                            requestProductTo: 'Ware House'
                        }]
                    },
                    {
                        $or: [{
                            status: 'Received'
                        }, {
                            status: 'Partially Received'
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$productDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$createdDateTime"
                    },
                    year: {
                        $year: "$createdDateTime"
                    },
                    productDetails: '$productDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.productDetails.status': 'Received'
                }, {
                    '_id.productDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productDetails.productId',

                },
                receivedQty: {
                    $sum: "$_id.productDetails.receivedDetails.receivedQty"
                },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
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
                from: "products",
                localField: "_id.productId",
                foreignField: "productId",
                as: "product"
            },
        }, {
            "$unwind": "$product"
        },

        {
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
        },
                {
            $lookup: {
                from: "units",
                localField: "product.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                'orderdedQty': -1
            }
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
//Get Expiry Product details
function getExpiryProduct(req, res) {
    Product.aggregate({
            $match: {
                'expiryDate': {
                    $lt: ksHelper.getDate()
                }
            }
        }, {
            $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "subCategoryId",
                as: "subCategory",
            },

        }, {
            $unwind: "$subCategory"
        }, {
            $lookup: {
                from: "categories",
                localField: "subCategory.categoryId",
                foreignField: "categoryId",
                as: "category"
            },

        }, {
            $unwind: "$category"
        }, {
            $sort: {
                'expiryDate': -1
            }
        },

        function(err, products) {
            if (err)
                res.send(err);
            res.json(products);
        });
}
//Get top sold product details and filtered details
function getTopSoldProduct(req, res) {
    var filterDetail;
    if (req.query.month != undefined) {
        filterTopsoldProduct(req, res);
    } else {
        filterDetail = ksHelper.getMonthDetails();
        getTopProduct(req, res, filterDetail);
    }

}
//Filter the top sold sold product details
function filterTopsoldProduct(req, res) {
    ProductReport.aggregate({
            $match: {
                // $or: [{
                //     status: 'Received'
                // }, {
                //     status: 'Partially Received'
                // }]
                $and: [{
                        $or: [{
                            menuItem: false
                        }, {
                            requestProductTo: 'Ware House'
                        }]
                    },
                    {
                        $or: [{
                            status: 'Received'
                        }, {
                            status: 'Partially Received'
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$productDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$createdDateTime"
                    },
                    year: {
                        $year: "$createdDateTime"
                    },
                    productDetails: '$productDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.productDetails.status': 'Received'
                }, {
                    '_id.productDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productDetails.productId',

                },
                receivedQty: {
                    $sum: "$_id.productDetails.receivedDetails.receivedQty"
                },
                            price: { 
                "$multiply" : ["$_id.productDetails.unitPrice", 
                    {
                      $sum:"$_id.productDetails.receivedDetails.receivedQty" 
                    }
              
                ]
        },
            },
        }, {
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                           price:{
                    $sum:"$price"
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
        }, 
                {
            $lookup: {
                from: "units",
                localField: "product.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        },
        {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
                    orderdedQty: '$orderdedQty',
                    productName: '$product.productName',
                    categoryName: '$category.categoryName',
                    subCategoryName: '$subCategory.subCategoryName',
                    unitName:'$units.unitName',
                           price: '$price'

                }
            }
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                '_id.price': -1
            }
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
//Get the top sold product Details
function getTopProduct(req, res, filterDetail) {

    ProductReport.aggregate({
            $match: {
                $and: [{
                        $or: [{
                            menuItem: false
                        }, {
                            requestProductTo: 'Ware House'
                        }]
                    },
                    {
                        $or: [{
                            status: 'Received'
                        }, {
                            status: 'Partially Received'
                        }]
                    }
                ]
            }
        }, {
            "$unwind": "$productDetail"
        }, {
            $group: {
                _id: {
                    month: {
                        $month: "$createdDateTime"
                    },
                    year: {
                        $year: "$createdDateTime"
                    },
                    productDetails: '$productDetail',
                },
            },
        }, {
            $match: {
                $or: [{
                    '_id.productDetails.status': 'Received'
                }, {
                    '_id.productDetails.status': 'Partially Received'
                }]
            }
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productDetails.productId',

                },
                receivedQty: {
                    $sum: "$_id.productDetails.receivedDetails.receivedQty"
                },
            price: { 
                "$multiply" : ["$_id.productDetails.unitPrice", 
                    {
                      $sum:"$_id.productDetails.receivedDetails.receivedQty" 
                    }
              
                ]
        },
            },
        },{ 
            $group: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
                },
                orderdedQty: {
                    $sum: "$receivedQty"
                },
                price:{
                    $sum:"$price"
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
        },
                {
            $lookup: {
                from: "units",
                localField: "product.unitId",
                foreignField: "unitId",
                as: "units"
            },
        }, {
            "$unwind": "$units"
        }, {
            $project: {
                _id: {
                    month: '$_id.month',
                    year: '$_id.year',
                    productId: '$_id.productId',
                    orderdedQty: '$orderdedQty',
                    productName: '$product.productName',
                    categoryName: '$category.categoryName',
                    subCategoryName: '$subCategory.subCategoryName',
                    unitName:'$units.unitName',
                    price: '$price'

                }
            }
        }, {
            $sort: {
                '_id.year': -1,
                '_id.month': -1,
                '_id.price': -1
            }
        },

        function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
}
module.exports = router;