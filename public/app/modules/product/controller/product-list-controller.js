/**
 * Product List Controller
 */
(function() {
    'use strict';
    angular
        .module('product')
        .controller('productListController', ProductListController)

    ProductListController.$inject = ['dataService', 'commonService', '$filter', '$state', 'ksAlertService', 'outlets', 'auth'];
    /**
     * @memberof module:product
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires $state
     * @requires ksAlertService
     * @requires outlets
     * @requires auth
     * @ngInject
     */
    function ProductListController(dataService, commonService, $filter, $state, ksAlertService, outlets, auth) {
        var self = this,
            url = '/api/products';
        // Setting the maximum number of pages in summary list.
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteProduct = deleteProduct;
        self.updateProduct = updateProduct;
        self.checkBranchValidation = checkBranchValidation;
        self.setTab = setTab;
        self.isSet = isSet;
        self.tab = 1;
        self.authorization = authorization;
        self.print = commonService.print;
        self.downloadPdf = commonService.downloadPdf;
        // Chooseing the particular field in summary list.
        self.fChooser_Product = {
            'Product_Id': true,
            'Product_Name': true,
            'Category': true,
            'SubCategory': true,
            'Monthly_Average': true,
            'Default_Suppplier': true
        };
        // Initialize the all function to load the entire page.
        function init() {
            getProducts();
            self.availableLimits = commonService.paginationLimit();
            authorization();
        }
        //Set the Tab for Active Outlet Details
        function setTab(tabId) {
            this.tab = tabId;
        };
        //Set the Tab for InActive Outlet Details
        function isSet(tabId) {
            return this.tab === tabId;
        };
        /**
         * Set the count for a summary page.
         * @param count
         */
        function setValue(count) {
            commonService.setLimit(count);
        }
        /**
         * Initially show count for a summary page.
         * @param count
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }
        /**
         * Get the all product details using data service passing the URL.
         * On success call getting all product details in a summary list.
         */
        function getProducts() {
            return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.products = responseData;
                self.activeProducts = responseData.filter(function(product) {
                    return (product.status == 'Active');
                });
            }
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Based on the Id,delete the data from the product.
         * if product present in the menu cannot be deleted and displays the warning messages.
         * @param id
         * @param pid
         */
        function deleteProduct(id, pid) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var urldata = '/api/menudelete';
                dataService.deleteData(urldata, pid).then(successHandler, errorHandler); //passing the DELETE URL into dataService,while its sucesss will returns the data

                function successHandler(responseData) {
                    self.menu = responseData;
                    if (self.menu.length === 0) {
                        dataService.updateData(url, id, {
                            isActive: false
                        });
                        getProducts();
                    } else {
                        ksAlertService.warn('The product cannot be deleted.its depends on the menu');
                    }
                }
            });
        }
        /**
         * Update the product details using data service passing the URL.
         * Its first validate the product details and allow to update data.
         * On success call getting all product details in a summary list.
         * @param product
         */
        function updateProduct(product) {
            product.status = "Active";
            dataService.updateData(url, product._id, product).then(successHandler, errorHandler);

            function successHandler(responseData) {
                init();
                self.tab = 1;;
            }
        }
        //Check wheather warehouse and centrelized kitchen or not
        function checkBranchValidation() {
            var warehouse = outlets.filter(function(outlet) {
                return ((outlet.outletType.outletType === 'Ware House') && (outlet.outletStatus === 'Active'));
            });
            if (warehouse.length == 0) {
                ksAlertService.warn('Please add atleast one centrelized kitchen or warehouse');
            } else {
                $state.go('root.product');
            }

        }
        //To check the authorization role or not
        function authorization() {
            var role = auth.role;
            var rolesDetails = commonService.getRolesDetails().then(function(predefinedRoles) {
                    var predefinedRoles = predefinedRoles;
                    var accessRoles = predefinedRoles.filter(function(accessRoles) {
                        return accessRoles.role === role;
                    })[0];
                    self.authorizeData = accessRoles.access;
                },
                function(data) {
                    console.log('JSON retrieval failed.')
                });;
        }
        init();
    }
}());