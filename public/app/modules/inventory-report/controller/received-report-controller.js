    /**
     *Received Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('inventory')
            .controller('receivedDetailController', receivedDetailController)
        receivedDetailController.$inject = ['commonService', 'dataService', '$state', 'employees', 'reportDetails', 'outlets', 'franchiseBranches', 'auth'];

        /**
         * @memberof module:inventory
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $state
         * @requires employees
         * @requires reportDetails
         * @requires outlets
         * @requires franchiseBranches
         * @ngInject
         */

        function receivedDetailController(commonService, dataService, $state, employees, reportDetails, outlets, franchiseBranches, auth) {
            var self = this;

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.print = commonService.print;
            self.downloadPdf = commonService.downloadPdf;
            self.filterByProductReportDetails = filterByProductReportDetails;
            self.filterByMenuReportDetails = filterByMenuReportDetails;
            self.reset = reset;
            //Initalize the function
            function init() {
                self.reportDetails = getReportDetails(reportDetails);
                self.employees = employees;
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
             * Filter the received product details based on the params details
             * @param params
             */
            function filterByProductReportDetails(params) {
                var url = '/api/receivedByFilterProductReport';
                return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.reportDetails = getReportDetails(responseData);
                }
            }
            /**
             * Filter the received menu details based on the params details
             * @param params
             */
            function filterByMenuReportDetails(params) {
                var url = '/api/receivedByFilterMenuReport';
                return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.reportDetails = getReportDetails(responseData);
                }
            }
            /**
             * Reset the data in the form
             * @param receivedDetail
             */
            function reset(receivedDetail) {
                receivedDetail.fromDate = null;
                receivedDetail.toDate = null;
                self.reportDetails = reportDetails;
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
                        return (reportDetail._id.franchise.franchise === true);
                    });
                    return getBranchName(Details);
                }
            }

            /**
             * Get the branchName details
             * @param reportDetails
             */
            function getBranchName(reportDetails) {
                self.branchDetails = outlets.concat(franchiseBranches);
                angular.forEach(reportDetails, function(reportDetail) {
                    var branchData = self.branchDetails.filter(function(branchDetail) {
                        return (reportDetail._id.branchId === branchDetail.branchId);
                    });
                    reportDetail.branchName = branchData[0].branchName;
                })
                return reportDetails;
            }
            init();
        }
    }());