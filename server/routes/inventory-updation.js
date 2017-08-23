/**
 * Purchase Router
 */
var PurchaseOrder = require('../models/purchaseorder'),
    Inventorysetting = require('../models/inventorysetting'),
    Product = require('../models/product'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

router.route('/PurchaseOrders/:id')
    .put(updatePurchaseOrder)

function getProducts() {
    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Product.find({
                isActive: true
            }, function(err, products) {
                handleSuccess(products);
            })
        } catch (ex) {
            handleFailure(ex);
        }
    });
}

function upateInventoryProductQty(branchId, qty, requestTo) {

    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Inventorysetting.findOne({
                branchId: branchId
            }, function(err, inventory) {
                updateProductQuantities(inventory.listOfProducts, qty, requestTo);

                inventory.save(function(err) {
                    handleSuccess(true);
                });
            })
        } catch (ex) {
            handleFailure(ex);
        }
    });
}

function updateProductQuantities(products, quantities, requestTo) {
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
        } else {
            if (requestTo === 'supplier') {
                product.avilableQuantity = product.avilableQuantity + quantity.qty;
            } else {
                product.avilableQuantity = product.avilableQuantity - quantity.qty;
            }
        }

    })
}

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

function updatePurchaseOrder(req, res) {
    PurchaseOrder.findOne({
        _id: req.params.id
    }, function(err, purchaseOrder) {

        getProducts().then(function(products) {

            var qtyToBeDeducted = getUpdationProducts(purchaseOrder.productDetails, purchaseOrder.requestProductTo);

            upateInventoryProductQty(purchaseOrder.branchId, qtyToBeDeducted, purchaseOrder.requestProductTo).then(function(data) {
                if (data) {
                    purchaseOrder.save(function(err) {
                        if (err)
                            res.send(err);
                        res.send({
                            message: 'Successfully Done'
                        });
                    });
                }
            })
        })

    });
}