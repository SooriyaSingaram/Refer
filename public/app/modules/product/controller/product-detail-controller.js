/**
 * Product Detail Controller
 */
(function() {
    'use strict';
    angular
        .module('product')
        .controller('productDetailController', ProductDetailController)

    ProductDetailController.$inject = ['commonService', 'dataService', '$filter', '$state', 'supplier', 'category', 'subCategory', 'units', 'ksAlertService', 'outlets'];
    /**
     * @memberof module:product
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires $state
     * @requires supplier
     * @requires category
     * @requires subCategory
     * @requires units
     * @requires ksAlertService
     * @requires outlets
     * @ngInject
     */
    function ProductDetailController(commonService, dataService, $filter, $state, supplier, category, subCategory, units, ksAlertService, outlets) {
        var self = this,
            url = '/api/products',
            data;
        self.product = {};
        //Add & Remove functions in Unit Conversion grid
        self.addUnits = addUnits;
        self.removeUnits = removeUnits;
        //Add & Remove functions in Supplier Details grid
        self.addSupplier = addSupplier;
        self.removeSupplier = removeSupplier;
        //PageScroll,Reset functions in form page
        self.formValidation = commonService.formValidation;
        self.disablesubmit = disablesubmit;
        self.reset = reset;
        //Product Validation functions 
        self.supplierNameValidation = supplierNameValidation;
        // self.defaultSupplierValidation = defaultSupplierValidation;
        self.filterBysubCategory = filterBysubCategory;
        self.getUnitName = getUnitName;
        self.unitValidation = unitValidation;
        //Get,Create,Edit Product Details
        self.getProductDetails = getProductDetails;
        self.addProduct = addProduct;
        self.updateProduct = updateProduct;
        self.getProducts = getProducts;
        self.checkInventoryQty = checkInventoryQty;
        self.onlyNumbers = commonService.allowNumber;
        self.beforeRender = beforeRender;
        // self.getShelfLife = getShelfLife;
        self.getDefaultSupplierId = getDefaultSupplierId;

        // Initialize the all function to load the entire page.
        function init() {
            getProductDetails();
            getProducts();
            // checkBranchValidation();
            self.supplier = supplier;
            self.category = category;
            self.subCategory = subCategory;
            self.units = units;
        }
        /**
         * Set the values in the product module
         * @param product
         */
        function setData(product) {
            data = product;
            self.product = angular.copy(data);
            checkSupplierDetails();
        }

        //Reset the values in the product module.
        function reset() {
            setData(data);
        }
        /**
         * Get the product details based on Id using data service passing the URL.
         * On success call getting all product details in a summary list
         */
        function getProductDetails() {
            self.isEditmode = commonService.isEditMode();
            if (self.isEditmode === true) {
                commonService.getDataById(url).then(function(product) { //passing the GET URL by its Id into dataService,while its sucesss will returns the data
                    setData(product);
                });
            } else {
                setData({});
                checkSupplierDetails();
            }
        }
        // On click disablesubmit function which changes into enable field.  
        function disablesubmit() {
            self.submitbut = false;
        }
        /**
         * Get the product Unit conversion details based on,
         * push the data in a array
         * @param unitConversion
         */
        function addUnits(unitConversion) {

            if (isEmptyobj(unitConversion)) {
                self.product.unitConversion = [];
                self.product.unitConversion.push({
                    from: '',
                    to: '',
                    toUnit: ''
                });
            } else {
                unitConversion.push({
                    from: '',
                    to: '',
                    toUnit: ''
                });
            }
        }
        /**
         * While passing the object data it validate the empty object or not and,
         * returns the value.
         * @param obj
         */
        function isEmptyobj(obj) {
            for (var x in obj) {
                return false;
            }
            return true;
        }
        /**
         * Getting unit details from menu for particular product.
         * @param product
         */
        function getUnitName(product) {
            var menuUrl = '/api/Menudelete';
            if (product._id) {
                return dataService.getDataById(menuUrl, product.productId).then(successHandler, errorHandler);
            }

            function successHandler(responseData) {
                self.menuDetails = responseData;
                if (self.menuDetails.length > 0) {
                    ksAlertService.warn('Product depends on the  ' + self.menuDetails.length + " menu Item.Please change menus");
                    // product.unitConversion=[];
                  
                }
            }
        }

        /**
         * Removing unit row in a product page grid. 
         * @param units
         * @param index
         */
        function removeUnits(units, index) {
            units.splice(index, 1);
        }
        /**
         * Add supplier rows in a product page grid. 
         * @param supplier
         */
        function addSupplier(supplier) {
            supplier.push({
                defaultsupplier: '',
                price: '',
                id: ''
            });
        }
        /**
         * Removing supplier row in a product page grid. 
         * @param supplier
         * @param index
         */
        function removeSupplier(supplier, index) {
            if (supplier.length === 1) {
                ksAlertService.warn('Please select the atleast one supplier');
            } else {
                ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                    supplier.splice(index, 1);
                })
            }
        }
        /**
         * Checking supplier details for product which adds the multiple supplier value,
         * for creating the product details.
         */
        function checkSupplierDetails() {
            if (self.product && !self.product.supplierDetails) {
                self.product.supplierDetails = [];
                self.addSupplier(self.product.supplierDetails);
            }
        }
        /**
         * By getting supplier in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param supplierinformation,
         * @param supplier
         */
        function supplierNameValidation(supplierinformation, supplier) {
            var count = 0;
            angular.forEach(supplier, function(value, key) {
                if (value.id === supplierinformation.id) {
                    count++;
                }
            });
            if (count >= 2) {
                ksAlertService.warn('Already select the  supplier');
                supplierinformation.id = "";
            } else {
                var suppliers = self.supplier.filter(function(supplierdetail) {
                    return (supplierdetail.supplierId == supplierinformation.id);
                });
                supplierinformation.suppliername = suppliers[0].supplierName;
            }
        }
        /**
         * By getting default supplier in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param supplier
         */
        function getDefaultSupplierId(supplier) {
            if (supplier.defaultsupplier === "Yes") {
                self.product.defaultSupplier = supplier.id;
            }
        }

        /**
         * Category is filtered by using sub category for adding product details.
         * @param product
         * @param sname
         */
        function filterBysubCategory(product, subCategotyname) {
            if (product.categoryId === undefined && product.subCategoryId !== undefined) {
                angular.forEach(subCategory, function(value, key) {
                    if (value.subCategoryId === product.subCategoryId) {
                        product.categoryId = value.categoryId;
                    }
                });
            }
            if (subCategotyname !== undefined) {
                product.subCategoryId = undefined;
            }
        }
        /**
         * Update the product details using data service passing the URL.
         * Its first validate the product details and allow to update data.
         * On success call getting all product details in a summary list.
         * @param product
         */
        function updateProduct(product) {
            if (!productValidation(product))
                return false;

            dataService.updateData(url, product._id, product).then(successHandler, errorHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                $state.go('root.product-list');
            }
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Add the product details using data service passing the URL.
         * Its first validate the product details and allow to add data.
         * On success call getting all product details in a summary list.
         * @param product
         */
        function addProduct(product) {
            if (!productValidation(product))
                return false;

            dataService.saveData(url, product).then(successHandler, errorHandler); //passing the POST URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                $state.go('root.product-list');
            }
        }
        /**
         * Get the all product details using data service passing the URL.
         * On success call getting all product details in a summary list.
         */
        function getProducts() {
            return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.products = responseData;
            }
        }
        /**
         * Checking maximum and minimum quantity for product details.
         * @param min
         * @param max
         * @param product
         */
        function checkInventoryQty(min, max, product) {
            if (min >= max) {
                ksAlertService.warn("Min  qty should be less then maximum  qty");
                product.minWarehouseQty = '';
            }
            if (max <= 0) {
                ksAlertService.warn("Max qty should be greater then 0");
                product.maxWarehouseQty = '';
            }
        }
        /**
         * By getting all unit details in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param unit
         * @param defaultunit
         * @param unitconversion
         */
        function unitValidation(unit, defaultunit, unitconversion) {

            if (unit.toUnit === defaultunit) {
                ksAlertService.warn("Default unit cannot be converted");
                unit.toUnit = "";
            } else {
                var count = 0;
                angular.forEach(unitconversion, function(value, key) {
                    if (value.toUnit === unit.toUnit) {
                        count++;
                    }
                });
                if (count >= 2) {
                    ksAlertService.warn('Unit already exists');
                    unit.toUnit = "";
                } else {
                    unit.toUnit = unit.toUnit;
                }
            }
        }
        /**
         * By getting all product details in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param product
         */
        function productValidation(product) {
            var count = 0;
            angular.forEach(product.supplierDetails, function(value, key) {
                if (value.defaultsupplier === "Yes") {
                    count++;
                }
            });

            if (count >= 2 | count == 0) {
                ksAlertService.warn("Please select only one default supplier");
                return false;
            }

            for (var i = 0; i < self.products.length; i++) {
                var value = self.products[i];
                if (product._id === undefined) {
                    if (value.productName === product.productName) {
                        ksAlertService.warn("Product name already exists");
                        return false;
                    }
                } else {
                    if (value.productId !== product.productId && value.productName === product.productName) {
                        ksAlertService.warn("Product  name already exists");
                        return false;
                    }
                }
            }
            return true;
        }
        /**
         * before render the page automatically its call this function,
         * it disables the past dates
         * @param $dates
         */
        function beforeRender($dates) {
            for (var i = 0; i < $dates.length; i++) {
                if (new Date().getTime() > $dates[i].utcDateValue) {
                    $dates[i].selectable = false;
                }
            }
        }
        /**
         * Based on the expiry date calculate the shelf life
         * @param expiryDate
         */
        // function getShelfLife(expiryDate) {
        //     var today = new Date();
        //     var timeDiff = Math.abs(expiryDate.getTime() - today.getTime());
        //     var shelflife = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //     if (shelflife < 7) {
        //         ksAlertService.confirm("The product will be expired " + shelflife + " Days.Are You Sure You Want To proceed This ?").then(function() {
        //             self.product.shelfLife = shelflife;
        //         });
        //         self.product.shelfLife = '';
        //     } else {
        //         self.product.shelfLife = shelflife;
        //     }

        // }
        // function checkBranchValidation() {
        //     var warehouse = outlets.filter(function(outlet) {
        //         return ((outlet.outletType.outletType === 'Ware House') && (outlet.outletStatus === 'Active'));
        //     });
        //     var centrelizedKitchen = outlets.filter(function(outlet) {
        //         return ((outlet.outletType.outletType === 'Centralized Kitchen') && (outlet.outletStatus === 'Active'));
        //     });
        //     self.warehouseMode = true;
        //     self.checkMode = true;
        //     if (warehouse.length != 0) {
        //         self.warehouseMode = false;
        //     }
        //     if (centrelizedKitchen.length != 0) {
        //         self.checkMode = false;
        //     }
        // }
        init();
    }
}());