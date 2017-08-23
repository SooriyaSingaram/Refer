(function() {
    'use strict';
    angular
        .module('inventory')
        .controller('inventoryAddController', InventoryAddController)
    InventoryAddController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', '$state', 'product', 'unit','outlet'];
    /**
     * @memberof module:Inventory Settings
     *
     * This function is for CRUD operation and validation things for Inventory Module.
     * @requires commonService
     * @requires dataService
     * @requires state
     * @requires $filter
     * @requires ksAlertService
     * @requires menucategory
     * @requires products
     * @requires units
     * @requires outlet
     * @ngInject 
     */
    function InventoryAddController(commonService, dataService, $filter, ksAlertService, $state, product, unit,outlet) {
        var self = this;
        var url = '/api/inventorysettings';
        self.addInventory = addInventory;
        self.addProducts = addProducts;
        self.disablesubmit = disablesubmit;
        self.reset = reset;
        self.updateInventory = updateInventory;
        self.getInventoryDetails = getInventoryDetails;
        self.checkDuplicateProduct = checkDuplicateProduct;
        self.findDuplicateBranch = findDuplicateBranch;
        self.removeProduct = removeProduct;
        self.inventoryDetails = [];
        self.seperateProducts = seperateProducts;
        self.validateQuantity = validateQuantity;
        var data;
        var filtered;
        /*init()-Initial funtions when onloading file*/
        function init() {
            self.product = product;
            self.unit = unit;
            self.outlet=outlet;
            getAllInventory();
            getInventoryDetails();
        }
        /*getInventoryDetails()- Getting inventory items which is in active state for Edit functionality*/
        function getInventoryDetails() {
            self.isEditmode = commonService.isEditMode();
            if (self.isEditmode === true) {
                commonService.getDataById(url).then(function(inventoryDetails) {
                    //seperateProducts(inventoryDetails.outletType);

                    angular.forEach(inventoryDetails.listOfProducts, function(lproduct, lvalue) {
                        angular.forEach(self.product, function(key, value) {
                            if (lproduct.productId === key.productId) {
                                lproduct.unitName = key.unitdetails.unitName;
                                lproduct.productName = key.productName;
                            }
                        });
                    });
                    setData(inventoryDetails);
                });
            } else {
                setData({});
                checkProductDetails();
            }
        }

        function validateQuantity(availableQty,productId){
        
         angular.forEach(product, function(value) {
               if(value.productId == productId){ 
                    if(value.maxWarehouseQty < availableQty ){
                       ksAlertService.warn('Available Qty is greater than maximum inventory level,Are you sure to proceed?');
                      }
                   if(value.minWarehouseQty > availableQty){
                 ksAlertService.warn('Available Qty is less than minimum inventory level,Are you sure to proceed?');
               }
             }
          });
        }
        /*updateInventory()- Updating a particular inventory item
		 @param inventoryDetails,listOfProducts
		*/
        function updateInventory(inventoryDetails, listOfProducts) {
            dataService.updateData(url, inventoryDetails._id, inventoryDetails).then(successHandler);

            function successHandler(responseData) {
                $state.go('root.inventorylist');
            }
        }
        /**
         * Get the all Inventory details using data service passing the URL.
         */
        function getAllInventory() {
            dataService.getData(url).then(successHandler);

            function successHandler(responseData) {
                self.inventories = responseData;
            }
        }
        /*addInventory()-Creating Inventory Products using data service passing the URL.*/
        function addInventory(inventoryDetails, availableproducts) {

            var inventorys = self.inventories;

            if (inventorys.length != 0) {
                var warehouseInventory = inventorys.filter(function(el) {
                    return el.outletType === "Ware House";
                });

                var centralizedKitchenInventory = inventorys.filter(function(el) {
                    return el.outletType === "Centralized Kitchen";
                });


                if (inventoryDetails.outletType == "Ware House" && warehouseInventory.length != 0) {
                    if (inventoryDetails.listOfProducts.length !== 0) {

                        var warehouseInventoryId = warehouseInventory[0]._id;
                        var stockProducts = warehouseInventory[0].listOfProducts;
                        var newInventory = inventoryDetails.listOfProducts.concat(stockProducts);
                        var Inventory = inventoryDetails.listOfProducts = newInventory;

                        dataService.updateData(url, warehouseInventoryId, inventoryDetails).then(successHandler);
                    } else {
                        ksAlertService.warn('Please select the atleast one product');
                    }


                } else if (inventoryDetails.outletType == "Centralized Kitchen" && centralizedKitchenInventory.length != 0) {
                    if (inventoryDetails.listOfProducts.length !== 0) {
                        var centralizedInventoryId = centralizedKitchenInventory[0]._id;
                        var stockProducts = centralizedKitchenInventory[0].listOfProducts;
                        var newInventory = inventoryDetails.listOfProducts.concat(stockProducts);
                        var Inventory = inventoryDetails.listOfProducts = newInventory;

                        dataService.updateData(url, centralizedInventoryId, inventoryDetails).then(successHandler);
                    } else {
                        ksAlertService.warn('Please select the atleast one product');
                    }


                } else {
                    if (inventoryDetails.outletType == "Centralized Kitchen" && centralizedKitchenInventory.length == 0) {
                        if (inventoryDetails.listOfProducts.length !== 0) {
                            dataService.saveData(url, inventoryDetails).then(successHandler);
                        } else {
                            ksAlertService.warn('Please select the atleast one product');
                        }
                    } else {
                        if (inventoryDetails.listOfProducts.length !== 0) {

                            dataService.saveData(url, inventoryDetails).then(successHandler);


                        } else {
                            ksAlertService.warn('Please select the atleast one product');
                        }
                    }
                }

            } else {
                if (inventoryDetails.listOfProducts.length !== 0) {

                    dataService.saveData(url, inventoryDetails).then(successHandler);


                } else {
                    ksAlertService.warn('Please select the atleast one product');
                }



            }

            function successHandler(responseData) {
                $state.go('root.inventorylist');
            }

        }

        /*checkProductDetails()-Checking product property details form the Inventory products.*/
        function checkProductDetails() {
            if (self.inventoryDetails && !self.inventoryDetails.listOfProducts) {
                self.inventoryDetails.listOfProducts = [];
                self.addProducts(self.inventoryDetails.listOfProducts);
            }
        }

        /*getProduct()- Getting products and and list them in a grid.
         @param inventoryDetails,listOfProducts
        */
        function getProduct(availableproduct) {
            angular.forEach(availableproduct, function(productValue, key) {
                var productDetail = $filter('filter')(self.product, {
                    productId: productValue.productId
                });
                self.inserted = {
                    productId: productDetail[0].productId,
                    productName: productDetail[0].productName,
                    unitId: productDetail[0].unitId,
                    unitName: productDetail[0].unitdetails.unitName,
                    avilableQuantity: ''
                };
                self.inventoryDetails.listOfProducts.push(self.inserted);
            })
        }

        function addProducts(availbleProducts, listproducts) {
            if (self.inventoryDetails.listOfProducts.length === 0) {
                getProduct(availbleProducts);
            } else {
                var filteredProducts = checkDuplicateProduct(listproducts, availbleProducts);
                for (var i = 0; i < filteredProducts.length; i++) {
                    for (var j = 0; j < availbleProducts.length; j++) {
                        if (filteredProducts[i] == availbleProducts[j]) {
                            availbleProducts = availbleProducts.slice(0, j).concat(availbleProducts.slice(j + 1, availbleProducts.length));
                        }
                    }
                }
                getProduct(availbleProducts);
            }
        }

        /*CheckDuplicateProduct()- Check any duplicate product is selected
		 @param listOfProducts,customproduct
		*/
        function checkDuplicateProduct(listOfProducts, customproduct) {
            var filteredArray = [];
            angular.forEach(customproduct, function(cvalue, key) {
                angular.forEach(listOfProducts, function(lvalue, key) {
                    if (cvalue.productId === lvalue.productId) {
                        filteredArray.push(cvalue);
                    }
                });
            });
            return filteredArray;
        }

        /*findDuplicateBranch()-To Check any duplicate branch.
		 @param branch
		*/
        function findDuplicateBranch(branch) {
            var duplicateBranch = $filter('filter')(self.inventories, {
                branchId: branch
            });
            if (duplicateBranch.length != 0) {
                self.inventoryDetails.branchId = "";
                ksAlertService.warn('Branch already exists..please choose differnt one.');
            }
        }

        /*disablesubmit-Disabling submit button*/
        function disablesubmit() {
            self.submitbut = false;
        }
        /*setdata-Kept a copy of data for update functionality*/
        function setData(inventoryDetails) {
            data = inventoryDetails;
            self.inventoryDetails = angular.copy(data);
            checkProductDetails();
        }
        /*removeProduct-To remove the selected products in grid
		@param listOfProducts,index
		*/
        function removeProduct(listOfProducts, index) {
           if (listOfProducts.length === 1) {
                ksAlertService.warn('Please select the atleast one product');
            } else {
                     ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
              listOfProducts.splice(index, 1);
            });
              
            }
        }

        /*reset-To reset the available product in the grid.
         */
        function reset() {
            setData(data);
            self.availableProducts = '';
        }
        /*seperateProducts-To display the list of products for individual centrlized kitchen and wareHouseProduct
        and also avoid the duplicate produts which are not in the Inventory.
        @param outlet.
        */
        function seperateProducts(outlet) {

             var checkWareHouse = self.outlet.filter(function(el) {
                        return el.outletType.outletType === "Ware House";
                    });
                    if(checkWareHouse.length >0)
                    {
                      self.outletID=checkWareHouse[0].branchId;
                       self.outletName=checkWareHouse[0].branchName;
           
            var product = self.product;
            self.availableProducts = ''; 


                self.filtered = [];
                var inventorys = self.inventories;
                if (inventorys.length != 0) {

                    var result = inventorys.map(function(ab) {
                        return ab.listOfProducts;
                    });
                    var productIDS = [];

                    var inventoryPid = result.map(function(ab) {
                        var pID = ab.map(function(a) {
                            productIDS.push(a.productId);
                        });
                    });



                    var availProducts = product.map(function(ab) {
                        return ab.productId;
                    });
                    // var wareHouseProduct = product.filter(function(el) {
                    //     return el.centralizedKitchen === false
                    // });

                    var updatedProduct = product;

                    var diff = $(availProducts).not(productIDS).get();

                    for (var i = updatedProduct.length; i > 0; i--) {
                        if (!isInArray(updatedProduct[i - 1].productId, diff)) {
                            updatedProduct.splice(i - 1, 1);
                        }
                    }


                    self.filtered = updatedProduct;
                } else {
                    // if (outlet == "Ware House") {
                    //     var wareHouseProduct = product.filter(function(el) {
                    //         return el.centralizedKitchen === false
                    //     });
                    //     self.filtered = wareHouseProduct;
                    // } else {
                    //     var centralizedKitchenProduct = product.filter(function(el) {
                    //         return el.centralizedKitchen === true
                    //     });
                    //     self.filtered = centralizedKitchenProduct;
                    // }
                    self.filtered=product;


                }

             } 
             else
             {
                 console.log('pls create WH');
             }
            //else {
            //     self.filtered = [];
            //     var inventorys = self.inventories;
            //     if (inventorys.length != 0) {

            //         var result = inventorys.map(function(ab) {
            //             return ab.listOfProducts;
            //         });
            //         var productIDS = [];

            //         var inventoryPid = result.map(function(ab) {
            //             var pID = ab.map(function(a) {
            //                 productIDS.push(a.productId);
            //             });
            //         });



            //         var availProducts = product.map(function(ab) {
            //             return ab.productId;
            //         });
            //         var wareHouseProduct = product.filter(function(el) {
            //             return el.centralizedKitchen === true
            //         });

            //         var updatedProduct = wareHouseProduct;

            //         var diff = $(availProducts).not(productIDS).get();

            //         for (var i = updatedProduct.length; i > 0; i--) {
            //             if (!isInArray(updatedProduct[i - 1].productId, diff)) {
            //                 updatedProduct.splice(i - 1, 1);
            //             }
            //         }


            //         self.filtered = updatedProduct;
            //     } else {
            //         if (outlet == "Ware House") {
            //             var wareHouseProduct = product.filter(function(el) {
            //                 return el.centralizedKitchen === false
            //             });
            //             self.filtered = wareHouseProduct;
            //         } else {
            //             var centralizedKitchenProduct = product.filter(function(el) {
            //                 return el.centralizedKitchen === true
            //             });
            //             self.filtered = centralizedKitchenProduct;
            //         }
            //     }
            // }

        }


        init();

        function errorHandler(responseData) {
            init();
        }

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }
    }
}());