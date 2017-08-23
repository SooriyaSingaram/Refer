/**
 * Supplier List Controller
 */
(function() {

    'use strict';

    angular
        .module('supplier')
        .controller('supplierListController', SupplierListController)

    SupplierListController.$inject = ['dataService', 'commonService', '$filter', '$window', '$state', 'ksAlertService', 'auth'];
    /**
     * @memberof module:supplier
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires $state
     * @requires $window
     * @requires ksAlertService
     * @ngInject
     */
    function SupplierListController(dataService, commonService, $filter, $window, $state, ksAlertService, auth) {

        var self = this,
            url = '/api/suppliers';
        // Setting the maximum number of pages in summary list.
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteSupplier = deleteSupplier;
        self.authorization = authorization;
        // Chooseing the particular field in summary list.
        self.fChooser_supplier = {
            'Supplier_Id': true,
            'Supplier_Name': true,
            'Contact_No': true,
            'Email_Id': true,
            'Sales_Name': true,
            'Sales_No': true
        };
        // Initialize the all function to load the entire page.
        function init() {
            getSuppliers();
            self.availableLimits = commonService.paginationLimit();
            authorization();
        }
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
         * Get the all supplier details using data service passing the URL.
         * On success call getting all supplier details in a summary list.
         */
        function getSuppliers() {

            return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.suppliers = responseData;
            }
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Based on the Id,delete the data from the supplier.
         * if supplier present in the menu cannot be deleted and displays the warning messages.
         * @param id
         * @param status
         */
        function deleteSupplier(id, status) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                dataService.updateData(url, id, { //passing the UPDATE URL into dataService,while its sucesss will returns the data                                          
                    isActive: false
                }).then(successHandler, errorHandler);
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                init();
            }
        }

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