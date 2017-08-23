    /**
     *  PO Report Controller
     */
    (function() {
        'use strict';
        angular
            .module('purchase-order')
            .controller('purchaseOrderReportController', PurchaseOrderReportController)
        PurchaseOrderReportController.$inject = ['dataService', 'commonService', '$filter', 'outlets', 'franchiseBranches', 'reportDetails', 'products', 'auth'];

        /**
         * @memberof module:purchaseOrder
         *
         * CRUD application is performed and also displays the data
         * @requires dataService
         * @requires commonService
         * @requires $filter
         * @ngInject
         */
        function PurchaseOrderReportController(dataService, commonService, $filter, outlets, franchiseBranches, reportDetails, products, auth) {
            var self = this,
                data;

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.print = commonService.print;
            self.downloadPdf = commonService.downloadPdf;
            self.getFilteredPODetails = getFilteredPODetails;
            self.getFilterPayementDetails = getFilterPayementDetails;
            self.reset = reset;
            self.products = products;
            self.filterBySellingProduct = filterBySellingProduct;

            // Initialize the all function,its load the entire page.
            function init() {
                self.products = products;
                self.reportDetails = getReportDetails(reportDetails);
                data = angular.copy(getReportDetails(reportDetails));
                self.availableLimits = commonService.paginationLimit();
            }
            /**
             * Set the count for a summary list in a page
             * @param count
             */
            function setValue(count) {
                commonService.setLimit(count);
            }

            /**
             * Initially Show count for a summary list in a page
             * @param count
             */
            function isActiveValue(count) {
                commonService.isActiveLimit(count);
            }

            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }

            /**
             * Based on the role get the report details
             * @param reportDetails
             */
            function getReportDetails(reportDetails) {
                if ((auth.role === "KS_RS001") || (auth.role === "KS_RS002")) {
                    return getBranchName(reportDetails);
                } else if (auth.role === "KS_RS006") {
                    var Details = reportDetails.filter(function(reportDetail) {
                        return (reportDetail.franchise.franchise === true);
                    });
                    return getBranchName(Details);
                }
            }

            /**
             * Based on parameter filter the purchase order details
             * @param poDetails
             */
            function getFilteredPODetails(poDetails) {
                var url = "/api/purchaseOrdersDetails";
                return dataService.getDataFilterBy(url, poDetails).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.reportDetails = getReportDetails(responseData);
                }
            }
            /**
             * Based on payment parameter filter the purchase order details
             * @param poDetails
             */
            function getFilterPayementDetails(poDetails) {
                var filterUrl = "/api/purchaseOrdersPaymentReport";
                return dataService.getDataFilterBy(filterUrl, poDetails).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.reportDetails = getReportDetails(responseData);
                }
            }
            /**
             * Reset the data in the form
             * @param poDetails
             */
            function reset(poDetails) {
                poDetails.fromDate = null;
                poDetails.toDate = null;
                self.reportDetails = data;
            }
            /**
             * Based on the sellingDetails filter the data in the list
             * @param sellingPoDetails
             */
            function filterBySellingProduct(sellingPoDetails) {
                var filterUrl = "/api/purchaseOrdersSellingReport";
                return dataService.getDataFilterBy(filterUrl, sellingPoDetails).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.reportDetails = getReportDetails(responseData);
                }
            }
            /**
             *Get the Branch Name
             * @param reportDetails
             */
            function getBranchName(reportDetails) {
                self.branchDetails = outlets.concat(franchiseBranches);
                angular.forEach(reportDetails, function(reportDetail) {
                    var branchData = self.branchDetails.filter(function(branchDetail) {
                        return (reportDetail.branchId === branchDetail.branchId);
                    });
                    reportDetail.branchName = branchData[0].branchName;
                })
                return reportDetails;
            }
            init();
        }
    }());