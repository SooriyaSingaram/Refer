    /**
     * Menu Supplied Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('inventory')
            .controller('menuSuppliedDetailController', menuSuppliedDetailController)
        menuSuppliedDetailController.$inject = ['commonService', 'dataService', '$state', 'employees', 'outlets', 'franchiseBranches', 'auth'];

        /**
         * @memberof module:inventory
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $state
         * @requires employees
         * @ngInject
         */

        function menuSuppliedDetailController(commonService, dataService, $state, employees, outlets, franchiseBranches, auth) {
            var self = this,
                menuReportUrl = "/api/menuSuppliedreport";

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.print = commonService.print;
            self.downloadPdf = commonService.downloadPdf;
            self.filterByMenuDetails = filterByMenuDetails;
            self.menuReset = menuReset;

            //Initalize the Function
            function init() {
                getSuppliedMenudetails();
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

            //Get the menu suppliedby details
            function getSuppliedMenudetails() {
                return dataService.getData(menuReportUrl).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.menuSuppliedDetails = getReportDetails(responseData);

                }
            }
            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }

            /**
             * reset the data in the menu supplied List
             * @param suppliedDetail
             */
            function menuReset(suppliedDetail) {
                suppliedDetail.fromDate = null;
                suppliedDetail.toDate = null
                getSuppliedMenudetails();
            }

            /**
             * Filter the supplied details by Datewise
             * @param  params
             */
            function filterByMenuDetails(params) {
                var filterUrl = "/api/suppliedByMenuFilter";
                return dataService.getDataFilterBy(filterUrl, params).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.menuSuppliedDetails = getReportDetails(responseData);
                }
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
                        console.log(reportDetail);
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