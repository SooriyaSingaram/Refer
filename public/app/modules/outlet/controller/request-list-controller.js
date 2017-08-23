/**
 * Request List Controller
 * @Outlet Module
 */
(function() {

    'use strict';

    angular
        .module('outlet')
        .controller('requestListController', RequestListController)
    /**
     * controller for Listing all the Requests.
     *
     * @memberOf module:outlet
     *
     * @requires dataService
     * @requires commonService
     * @requires $filter
     * @requires $window 
     * @requires outlets 
     * @requires $state
     * @requires ksAlertService
     */
    RequestListController.$inject = ['dataService', 'commonService', '$filter', '$window', '$state', 'ksAlertService', 'outlets', 'franchises', 'auth'];

    function RequestListController(dataService, commonService, $filter, $window, $state, ksAlertService, outlets, franchises, auth) {

        var self = this,
            url = '/api/requests',
            disableAddButton;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteRequest = deleteRequest;
        self.authorization = authorization;

        /**
         * Field Chooser for grid
         * grid shows initially  following fields   
         */
        self.fChooser_request = {
            'outlet_id': true,
            'outlet_name': true,
            'raised_date': true,
            'franchise_name': true,
            'raised_by': true
        };
        /**
         * Initialize the functions while loading controller
         * Listing all the requests 
         */
        function init() {
            hideButton();
            getRequests();
            self.availableLimits = commonService.paginationLimit();
            authorization();
        }
        /**
         * Set limit for showing request list
         * @param {String} limit - selected count of entries to be shown in request list
         */
        function setValue(count) {
            commonService.setLimit(count);
        }
        /**
         * Initial limit for showing employee list
         * @param {String} limit - Initialy set limit of requests shown in the list 
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }
        /**
         * Get All the Requests using data service by passing Url
         * franchise and franchise branch are filtered to show in list
         */
        function getRequests() {
            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                self.requests = responseData;
                angular.forEach(responseData, function(request, key) {
                    var franchise = outlets.filter(function(branch) {
                        return (request.franchiseId == branch.branchId);
                    });
                    var franchiseBranch = franchises.filter(function(branch) {
                        return (request.franchiseId == branch.branchId);
                    });
                    console.log(franchiseBranch);
                    if (franchise[0]) {
                        request.branchName = franchise[0].branchName;
                    } else if (franchiseBranch[0]) {
                        request.branchName = franchiseBranch[0].branchName;
                    }
                })
            }


        }
        //hide add request button for outlets 
        function hideButton() {
            if(auth.role == 'KS_RS007') {
           self.hideAddRequest = true;

            }
        }
        /**
         * Delete Particular Request
         * @param {String} id,requestId - Particular request status updated to inactive based on id.
         */
        function deleteRequest(id, requestId) {
            ksAlertService.confirm("Do you want to delete the clicked item ?").then(function() {

                dataService.updateData(url, id, {
                    isActive: false
                }).then(successHandler);

            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted Successfully');
                init();
            }
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running request list controller
         */
        function errorHandler(e) {
            console.log(e.toString());
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