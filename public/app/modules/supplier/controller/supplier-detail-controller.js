/**
 * Supplier Detail Controller
 */
(function() {

    'use strict';

    angular
        .module('supplier')
        .controller('supplierDetailController', SupplierDetailController)

    SupplierDetailController.$inject = ['commonService', 'dataService', '$filter', 'countryCodes', '$state', 'ksAlertService'];
    /**
     * @memberof module:supplier
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires countryCodes
     * @requires $state
     * @requires ksAlertService
     * @ngInject
     */
    function SupplierDetailController(commonService, dataService, $filter, countryCodes, $state, ksAlertService) {

        var self = this,
            url = '/api/suppliers',
            data;
        self.supplier = {};

        self.disableSubmit = disableSubmit; // Disables the fields in form page.

        //Get,Create,Edit Supplier Details
        self.getSupplierDetails = getSupplierDetails;
        self.addSupplier = addSupplier;
        self.updateSupplier = updateSupplier;
        self.reset = reset;
        //Supplier Validation functions
        self.formValidation = commonService.formValidation;
        self.supplierValidation = supplierValidation;
        self.onlyNumbers = commonService.allowNumber;

        // Initialize the all function to load the entire page.
        function init() {
            getSuppliers();
            getSupplierDetails();
            self.countryCodes = countryCodes;
        }
        /**
         * Get the supplier details based on Id using data service passing the URL.
         * On success call getting all supplier details in a summary list
         */
        function getSupplierDetails() {

            self.isEditmode = commonService.isEditMode();

            if (self.isEditmode === true) {
                commonService.getDataById(url).then(function(supplier) { //passing the GET URL by its Id into dataService,while its sucesss will returns the data
                    setData(supplier);
                });
            } else {
                setData({});
            }
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
        // On click disableSubmit function which changes into enable field. 
        function disableSubmit() {
            this.submitbut = false;
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Add the supplier details using data service passing the URL.
         * Its first validate the supplier details and allow to add data.
         * On success call getting all supplier details in a summary list.
         * @param supplier
         */
        function addSupplier(supplier) {

            if (!supplierValidation(supplier))
                return false;
            supplier.email = supplier.email.toLowerCase();
            dataService.saveData(url, supplier).then(successHandler, errorHandler); //passing the POST URL into dataService,while its sucesss will returns the data


            function successHandler(responseData) {             
                    $state.go('root.supplier_list');      
                }
        }
        /**
         * Update the supplier details using data service passing the URL.
         * Its first validate the supplier details and allow to update data.
         * On success call getting all supplier details in a summary list.
         * @param supplier
         */
        function updateSupplier(supplier) {

            if (!supplierValidation(supplier))
                return false;
            supplier.email = supplier.email.toLowerCase();
            dataService.updateData(url, supplier._id, supplier).then(successHandler, errorHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                 ksAlertService.warn(responseData.message);
                 $state.go('root.supplier_list');
            }
        }
        /**
         * By getting all supplier details in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param supplier
         */
        function supplierValidation(supplier) {
            for (var i = 0; i < self.suppliers.length; i++) {
                var value = self.suppliers[i];
                if (supplier._id === undefined) {

                    if (value.code === supplier.code && value.phnNo === supplier.phnNo) {
                        ksAlertService.warn("Mobile no already exists");
                        return false;
                    }

                    if (value.email === supplier.email) {
                        ksAlertService.warn("Email already exists");
                        return false;
                    }
                } else {
                    if (value.supplierId !== supplier.supplierId && value.code === supplier.code && value.phnNo === supplier.phnNo) {
                        ksAlertService.warn("Mobile no already exists");
                        return false;
                    }
                    if (value.supplierId !== supplier.supplierId && (value.email === supplier.email)) {
                        ksAlertService.warn("Email already exists");
                        return false;
                    }
                }
            }
            return true;
        }
        /**
         * Set the values in the supplier module
         * @param supplier
         */
        function setData(supplier) {
            data = supplier;
            self.supplier = angular.copy(data);
        }
        //Reset the values in the supplier module.
        function reset() {
            setData(data);
        }
        init();
    }
    

}());