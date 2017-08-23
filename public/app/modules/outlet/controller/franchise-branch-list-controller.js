    /**
     * Franchise Branch List Controller
     */
    (function() {
        'use strict';
        angular
            .module('outlet')
            .controller('franchiseBranchListController', FranchiseBranchListController)
        FranchiseBranchListController.$inject = ['dataService', 'commonService', '$filter', '$state', 'ksAlertService', 'outlets', 'auth'];

        /**
         * @memberof module:outlet
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $filter
         * @requires countryCodes
         * @requires $state
         * @requires ksAlertService
         * @requires outlets
         * @requires auth
         * @ngInject
         */
        function FranchiseBranchListController(dataService, commonService, $filter, $state, ksAlertService, outlets, auth) {
            var self = this,
                url = '/api/franchisebranchs';

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.deleteFranchiseBranch = deleteFranchiseBranch;
            self.setTab = setTab;
            self.isSet = isSet;
            self.statusValidation = statusValidation;
            self.tab = 1;
            self.authorization = authorization;

            //Set the Tab for Active Franchise  Branch Details
            function setTab(tabId) {
                this.tab = tabId;
            };
            //Set the Tab for InActive Franchise  Branch Details
            function isSet(tabId) {
                return this.tab === tabId;
            };
            // Initialize the all function,its load the entire page.
            function init() {
                getFranchiseBranchs();
                self.availableLimits = commonService.paginationLimit();
                authorization();
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
            /**
             * Filed chooser
             * Based on the this filed chooser show and hide the column in a list.
             */
            self.fChooser_franchiseBranch = {
                'franchiseBranch_Name': true,
                'status': true,
                'phoneNo': true
            };
            /**
             * Get the all franchise branch details using data service passing the URL.
             * On success call getting all franchise branch details 
             * To filter the active state franchise branch details in a summary list
             */
            function getFranchiseBranchs() {
                return dataService.getData(url).then(successHandler, errorHandler); //passing the Get URL to dataService,its sucesss returns the data
                function successHandler(responseData) {
                    self.franchiseBranchs = responseData;
                    self.activeFranchiseBranchs = self.franchiseBranchs.filter(function(franchise) {
                        return (franchise.status == 'Active');
                    });
                }
            }
            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }
            /**
             * Based on the id ,update the delete status from the franchise branches.
             * It displays the confirmation message.if it click Yes,delete the data in a summary list.
             * @param id
             */
            function deleteFranchiseBranch(id) {
                ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler, errorHandler);
                });

                function successHandler(responseData) {
                    ksAlertService.warn('Deleted successfully');
                    init();
                }
            }
            /**
             * Validate the status and update the franchise Details.
             * If franchise status is Inactive cannot update franchise branch status is Active,
             * it shows the warning message.
             * @param franchiseBranch
             */
            function statusValidation(franchiseBranch) {
                var franchises = outlets.filter(function(outletDetail) {
                    return ((franchiseBranch.franchiseId === outletDetail.branchId) && (outletDetail.outletStatus === 'Inactive'));
                });

                if (franchises.length > 0) {
                    ksAlertService.warn("Status cannot be changed");
                    franchiseBranch.status = 'Inactive';
                } else {
                    franchiseBranch.status = 'Active';
                    dataService.updateData(url, franchiseBranch._id, franchiseBranch).then(successHandler, errorHandler);
                }

                function successHandler(responseData) {
                    self.tab = 1;
                    init();
                }
            }
            //To check the authorzation role or not
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
                    });
            }
            init();
        }
    }());