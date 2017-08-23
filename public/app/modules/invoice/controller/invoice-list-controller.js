/**
 * Invoice List Controller
 */
(function() {

    'use strict';

    angular
        .module('invoice')
        .controller('invoiceListController', InvoiceListController)

    InvoiceListController.$inject = ['dataService', 'commonService', '$filter', '$window', '$state', 'ksAlertService', 'auth', 'outlets', 'franchisebranchs'];
    /**
     * @memberof module:invoice
     
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires $state
     * @requires $window
     * @requires ksAlertService
     * @requires auth
     * @ngInject
     */
    function InvoiceListController(dataService, commonService, $filter, $window, $state, ksAlertService, auth, outlets, franchisebranchs) {

        var self = this,
            url = '/api/invoices';
        // Setting the maximum number of pages in summary list.
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteInvoice = deleteInvoice;
        self.authorization = authorization;
        // Chooseing the particular field in summary list.
        self.fChooser_invoice = {
            'Date': true,
            'PO_Number': true,
            'Invoice_No': true,
            'Amount': true,
            'Branch': true,
            'Status': true
        };
        // Initialize the all function to load the entire page.
        function init() {
            getInvoices();
            self.availableLimits = commonService.paginationLimit();
            authorization();
            self.outlets = outlets;
            self.franchisebranchs = franchisebranchs;
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
         * Get the all invoice details using data service passing the URL.
         * On success call getting all invoice details in a summary list.
         */
        function getInvoices() {

            return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {

                if ((auth.role === "KS_RS001") || (auth.role === "KS_RS002")) {
                    self.invoices = getBranchName(responseData);
                } else if (auth.role === "KS_RS006") {
                    var depositDetails = responseData.filter(function(depositDetail) {
                        return (depositDetail.franchise.franchise === true);
                    });
                    self.invoices = getBranchName(depositDetails);
                } else if (auth.role === "KS_RS008") {
                    var depositDetails = responseData.filter(function(depositDetail) {
                        return (depositDetail.franchise.franchise === true);
                    });
                    self.invoices = getBranchName(depositDetails);
                } else {
                    var depositDetails = responseData.filter(function(depositDetail) {
                        return (depositDetail.branchId === auth.branchId);
                    });
                    self.invoices = getBranchName(depositDetails);
                }
            }
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Based on the Id,delete the data from the invoice.
         * if invoice present in the menu cannot be deleted and displays the warning messages.
         * @param id
         * @param status
         */
        function deleteInvoice(id, status) {
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
        /**
         * Get branchName details
         * @param depositDetails
         */
        function getBranchName(invoiceDetails) {
            self.branchDetails = outlets.concat(franchisebranchs);
            angular.forEach(invoiceDetails, function(invoiceDetail) {
                var branchData = self.branchDetails.filter(function(branchDetail) {
                    return (invoiceDetail.branchId === branchDetail.branchId);
                });
                invoiceDetail.branchName = branchData[0].branchName;
            })
            return invoiceDetails;
        }
        //To check the role is authorized or not
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