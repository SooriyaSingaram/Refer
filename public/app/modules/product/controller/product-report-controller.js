/**
 * Product Report Controller
 */
(function() {
    'use strict';
    angular
        .module('product')
        .controller('productReportController', ProductReportController)

    ProductReportController.$inject = ['dataService', 'commonService', '$filter', 'productReport'];
    /**
     * @memberof module:product
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires productReport
     * @ngInject
     */
    function ProductReportController(dataService, commonService, $filter, productReport) {
        var self = this,
            productDetails;

        // Setting the maximum number of pages in summary list.
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        // self.filterDate = filterDate;
        self.filterByMonth = filterByMonth;
        self.reset = reset;
        // self.filterByDate = filterByDate;
        self.filterByTopProduct = filterByTopProduct;
        // self.basedOndate = basedOndate;
        self.print = commonService.print;
        self.downloadPdf = commonService.downloadPdf;

        // Initialize the all function to load the entire page.
        function init() {
            self.availableLimits = commonService.paginationLimit();
            self.productReport = productReport;
            productDetails = angular.copy(productReport);
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
         * Based on the Expiry date filter the details
         * @param from
         * @param to
         */
        // function filterByDate(from, to) {

        //     var details = [];
        //     $filter('filter')(productDetails, function(v) {

        //         var itemDate = new Date(v.expiryDate);
        //         itemDate.setHours(0, 0, 0, 0);
        //         var date = moment(itemDate);
        //         if (date >= moment(new Date(from)) && date <= moment(new Date(to))) {
        //             details.push(v);
        //         }
        //     });
        //     self.productReport = details;
        // }
        /**
         * Based on the month and year filter the monthly product details
         * @param date
         */
        function filterByMonth(date) {
            var params = {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
            var url = '/api/productReport';
            return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.productReport = responseData;
            }
        }
        /**
         * Based on the month and year filter the top sold product details
         * @param date
         */
        function filterByTopProduct(date) {
            var params = {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
            var url = '/api/topsoldProduct';
            return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.productReport = responseData;
            }
        }
        //Reset the data in the form
        function reset() {
            self.month = null;
            self.product = null;
            self.productReport = productReport;
        }
        init();
    }
}());