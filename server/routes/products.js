/**
 * Product Router
 */
var Product = require('../models/product'),
    Menu = require('../models/menu'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Products')
    .get(getProductDetails)
    .post(addProducts);

router.route('/Products/:id')
    .put(updateProduct)
    .get(getProductById)

router.route('/Menudelete/:id')
    .get(deleteProduct);



    function getProductDetails(req,res)
    {
    console.log(req.query);
         if(req.query.id === 'all')
         {
 getAllProducts(req,res);
         }
         else
         {
             getProducts(req,res);
         }
    }

//Get the All the Product Details 
function getProducts(req, res) {
    Product.aggregate({
            $lookup: {
                from: "units",
                localField: "unitId",
                foreignField: "unitId",
                as: "unitdetails"
            },
        }, {
            $unwind: "$unitdetails"
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
            $lookup: {
                from: "suppliers",
                localField: "defaultSupplier",
                foreignField: "supplierId",
                as: "defaultSupplierDetails"
            },

        }, {
            $unwind: "$defaultSupplierDetails"
        }, {
            $match: {
                isActive: true
            }
        },
        function(err, products) {
            if (err)
                res.send(err);
            res.json(products);
        });
}
//Create the New Product
function addProducts(req, res) {
    var product = new Product(req.body);
    Product.count({}, function(err, count) {
        product.productId = ksHelper.getModelId('KS_P', count);
        product.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Update the Product Details for Particular Id
function updateProduct(req, res) {
    Product.findOne({
        _id: req.params.id
    }, function(err, product) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            product[prop] = req.body[prop];
        }

        // save product details
        product.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Product
function deleteProduct(req, res) {
    Menu.find({
        ingredients: {
            $elemMatch: {
                productId: req.params.id
            }
        },
        isActive: true
    }, function(err, menu) {
        if (err)
            res.send(err);

        res.json(menu);
    });
}
//Get the Product Details for Particular Id
function getProductById(req, res) {
    Product.findOne({
        _id: req.params.id
    }, function(err, product) {
        if (err)
            res.send(err);

        res.json(product);
    });
}
function getAllProducts(req,res)
{
      Product.aggregate({
            $lookup: {
                from: "units",
                localField: "unitId",
                foreignField: "unitId",
                as: "unitdetails"
            },
        }, {
            $unwind: "$unitdetails"
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
            $lookup: {
                from: "suppliers",
                localField: "defaultSupplier",
                foreignField: "supplierId",
                as: "defaultSupplierDetails"
            },

        }, {
            $unwind: "$defaultSupplierDetails"
        },
     
        function(err, products) {
            if (err)
                res.send(err);
            res.json(products);
        }); 
}
module.exports = router;