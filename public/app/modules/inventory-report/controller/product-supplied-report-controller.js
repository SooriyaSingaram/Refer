    /**
     * Supplied Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('inventory')
            .controller('productsuppliedDetailController', productsuppliedDetailController)
        productsuppliedDetailController.$inject = ['commonService', 'dataService', '$state', 'employees', 'suppliers', 'outlets', 'franchiseBranches', 'auth'];

        /**
         * @memberof module:inventory
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $state
         * @requires employees
         * @requires suppliers
         * @ngInject
         */

        function productsuppliedDetailController(commonService, dataService, $state, employees, suppliers, outlets, franchiseBranches, auth) {
            var self = this,
                url = '/api/inventorySuppliedReport';

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.print = commonService.print;
            self.downloadPdf = commonService.downloadPdf;
            self.getFilteredDetails = getFilteredDetails;
            self.productReset = productReset;

            //Initalize the function
            function init() {
                getSuppliedDetails();
                self.employees = employees;
                self.suppliers = suppliers;
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
            //Get the product supplied Details
            function getSuppliedDetails() {
                return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    var suppliedDetails = getSuppliedByName(responseData);

                    self.productSuppliedDetails = getReportDetails(suppliedDetails);

                }
            }
            /**
             * Based on the product supplied details to get the supplier name
             * @param suppliedDetails
             */
            function getSuppliedByName(suppliedDetails) {
                var supplier = suppliedDetails.filter(function(supplier) {
                    return ((supplier._id.requestProductTo === "Supplier"));
                });
                var employee = suppliedDetails.filter(function(employee) {
                    return (!(employee._id.requestProductTo === "Supplier"));
                });
                if (supplier.length != 0) {
                    angular.forEach(supplier, function(suppliedData) {
                        angular.forEach(suppliers, function(supplier) {
                            if (suppliedData._id.supplierId === supplier.supplierId) {
                                suppliedData["suppliedByName"] = supplier.supplierName;
                            }
                        })

                    })
                }
                if (employee.length != 0) {
                    angular.forEach(employee, function(suppliedData) {
                        angular.forEach(employees, function(employee) {
                            if (suppliedData._id.suppliedDetails.suppliedId === employee.employeeId) {
                                suppliedData["suppliedByName"] = employee.employeeName;
                            }
                        })

                    })
                }

                var suppliedData = supplier.concat(employee);
                return suppliedData;
            }

            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }
            /**
             * Filter the supplied product details based on the Datewise
             * @param params
             */
            function getFilteredDetails(params) {
                var filterUrl = "/api/suppliedByProductFilter";
                return dataService.getDataFilterBy(filterUrl, params).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    var suppliedDetails = getSuppliedByName(responseData);
                    self.productSuppliedDetails = getReportDetails(suppliedDetails);
                }
            }
            /**
             * reset the data in the form
             * @param suppliedDetail
             */
            function productReset(suppliedDetail) {
                suppliedDetail.fromDate = null;
                suppliedDetail.toDate = null;
                getSuppliedDetails();
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