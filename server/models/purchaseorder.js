var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var baseSchema = require("./base.js");
var purchaseOrderSchema = baseSchema.extend({
    purchaseOrderNo : {
        type : String
    },
    purchaseOrderId : {
        type : String
    },
    branchId : {
        type : String
    },
    menuItem : {
        type : Boolean
    },
    status : {
        type : String
    },
    createdBy : {
        type : String
    },
    updatedBy : {
        type : String
    },
    requestProductTo : {
        type : String
    },
    supplierId:{
        type : String
    },
    branchType : {
        type : String
    },
    wareHouseId :{
        type : String
    },
    supplierId:{
        type : String
    },
     menuDetail :
    [{
        itemId : {
            type : String
        },
        qty : {
            type : Number
        },
        receivedQty : {
            type : Number
        },
        suppliedQty : {
            type : Number
        },               
        deliveryDate : {
            type : Date
        },
        description : {
            type : String
        },
        status:{
          type : String
        },
        unitPrice:{
            type : Number
        },
        unitId :{
            type : String
        },
        totalPrice:{
            type : Number
        },
        suppliedDetails:[{
         suppliedDate : {
            type : Date
        },
        suppliedQty:{
            type:Number
        },
        suppliedId:{
            type : String
        }
        }],
        receivedDetails:[{
         receivedDate : {
            type : Date
        },
        receivedQty:{
            type:Number
        },
         receivedId:{
            type : String
        }
        }]
                 
    }],
    productDetail :[{
        productId : {
            type : String
        },
        productName : {
            type : String
        },
        orderedQty : {
            type : Number
        },
        newOrderQty : {
            type : Number
        },
        receivedQty : {
            type : Number
        },
        suppliedQty : {
            type : Number
        },
        suppliernames : {
            type: Array
        },
        supplierId : {
            type : String
        },
        status : {
            type : String
        },
        unitPrice:{
            type : Number
        },
        unitId :{
            type : String
        },
        unitName : {
            type: String
        },
        suppliedDetails:[{
         suppliedDate : {
            type : Date
        },
        suppliedQty:{
            type:Number
        },
        suppliedId:{
            type : String
        }

        }],
        receivedDetails:[{
        receivedDate : {
            type : Date
        },
        receivedQty:{
            type:Number
        },
        receivedId:{
            type : String
        }
        }]          
    }],
        franchise: {
        franchise: {
            type: Boolean
        },
        franchiseId: {
            type: String
        }
    }
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports.schema = purchaseOrderSchema;