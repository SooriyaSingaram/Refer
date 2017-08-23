/**
 * Request Detail Controller
 * @Outlet Module
 */
(function() {

    'use strict';

    angular
        .module('outlet')
        .controller('requestController', RequestController)

    RequestController.$inject = ['commonService', 'dataService', 'request', 'outlets', 'franchise', '$state', 'auth', 'ksAlertService'];

    /**
     * controller for Request creation  
     * request to outlet by franchise and franchise branch.
     * @memberOf module:outlet
     *
     * @requires commonService
     * @requires dataService
     * @requires request
     * @requires employees 
     * @requires outlets 
     * @requires $state
     * @requires ksAlertService
     */

    function RequestController(commonService, dataService, request, outlets, franchise, $state, auth, ksAlertService) {

        var self = this,
            url = '/api/requests',
            data, branchId;

        self.request = {};
        self.disableSubmit = disableSubmit;
        self.getRequestDetails = getRequestDetails;
        self.addRequest = addRequest;
        self.updateRequest = updateRequest;
        self.reset = reset;
        self.formValidation = commonService.formValidation;

        /**
         * Initialize the functions while loading controller
         * Get all requests to show in the list
         * Outlet and franchise are filtered to show in drop down 
         */
        function init() {
            getRequestDetails();
            self.outlets = outlets;
            self.auth = auth;
            self.franchiseBranchType = franchise;
            self.requests = request[0];
            self.franchiseOutlets = self.outlets.filter(function(outlet) {
                return (outlet.outletType.outletType == 'Outlet');
            });
            self.franchise = self.outlets.filter(function(outlet) {
                return (outlet.outletType.outletType == 'Franchise');
            });
            self.branch = self.outlets.filter(function(outlet) {
                return (outlet.branchId == auth.branchId);
            });
            self.franchiseBranch = franchise.filter(function(outlet) {
                return (outlet.branchId == auth.branchId);
            });
            if (auth.role !== "KS_RS001" && auth.role !== "KS_RS006") {
                if (self.branch[0]) {
                    branchId = self.branch[0].outletType.outletType;
                } else if (self.franchiseBranch[0]) {
                    branchId = 'Franchise Branch';
                }
            }
        }
        /**
         * Copy form data if values are available 
         * @param {String} request Request values set to form field
         */
        function setData(request) {
            data = request;
            self.request = angular.copy(data);
        }
        /**
         * Reset all form fields to their default values 
         */
        function reset() {
            setData(data);
        }
        /**
         * Get the Request details based on Id using data by service passing the URL.
         */
        function getRequestDetails() {
            self.isEditmode = commonService.isEditMode();

            if (self.isEditmode === true) {
                commonService.getDataById(url).then(function(request) {
                    setData(request);
                });
            } else {

            }
        }
        /**
         * enable form field on click the edit button
         */
        function disableSubmit() {
            self.submitbut = false;
        }
        /**
         * Update particular Request detail using data service passing the URL.
         * @param {String} request - to update Request detail 
         */
        function updateRequest(request) {
            request.raisedBy = auth.employeeId;
            dataService.updateData(url, request._id, request).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.request-list');
            }

        }
        /**
         * Create Request detail using data service passing the URL.
         * @param {String} request Request detail to add
         */
        function addRequest(request) {


            if (branchId !== "Franchise" && branchId !== "Franchise Branch" && auth.role !== "KS_RS001" && auth.role !== "KS_RS006") {

                ksAlertService.warn("Only franchise or franchise branch can able to raise request");
                return false;
            }
            if (auth.role !== "KS_RS001" && auth.role !== "KS_RS006") {
                request.franchiseId = auth.branchId;

            }
            request.raisedDate = new Date();
            request.raisedBy = auth.employeeId;

            dataService.saveData(url, request).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.request-list');
            }
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running request detail controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }

}());