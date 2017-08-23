/**
 * Supplier Report Controller
 */
(function() {
    'use strict';
    angular
        .module('supplier')
        .controller('supplierReportController', SupplierReportController)

    SupplierReportController.$inject = ['dataService', 'commonService', '$filter', 'suppliers', 'supplierReport'];
    /**
     * @memberof module:supplier
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires suppliers
     * @requires supplierReport
     * @ngInject
     */
    function SupplierReportController(dataService, commonService, $filter, suppliers, supplierReport) {
        var self = this,
            url = '/api/supplierReport';

        // Setting the maximum number of pages in summary list.
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.getFilterData = getFilterData;
        self.reset = reset;
        self.print = commonService.print;
        self.downloadPdf = commonService.downloadPdf;

        // Initialize the all function to load the entire page.
        function init() {
            self.availableLimits = commonService.paginationLimit();
            self.suppliers = suppliers;
            self.supplierReport = supplierReport;
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
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Based on the month and year filter the monthly supplier details
         * @param supplierFilterReport
         */
        function getFilterData(supplierFilterReport) {

            var params = {
                month: (supplierFilterReport.date.getMonth() + 1),
                year: supplierFilterReport.date.getFullYear(),
                supplierId: supplierFilterReport.supplierId
            }

            var url = '/api/supplierFilterReport';
            return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.supplierReport = responseData;
            }
        }
        //Reset the data in the form
        function reset() {
            self.month = null;
            self.supplierReport = supplierReport;
        }

        init();
    }
}());