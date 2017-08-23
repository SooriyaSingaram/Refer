    /**
     * Outlet List Controller
     */
    (function() {
        'use strict';
        angular
            .module('outlet')
            .controller('outletListController', OutletListController)
        OutletListController.$inject = ['dataService', 'commonService', '$filter', '$state', 'ksAlertService', 'franchiseBranches', 'auth'];

        /**
         * @memberof module:outlet
         *
         * CRUD application is performed and also displays the data
         * @requires dataService
         * @requires commonService
         * @requires $filter
         * @requires $state
         * @requires ksAlertService
         * @requires franchiseBranches
         * @requires auth
         * @ngInject
         */
        function OutletListController(dataService, commonService, $filter, $state, ksAlertService, franchiseBranches, auth) {
            var self = this,
                data,
                url = '/api/outlets';

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.deleteOutlet = deleteOutlet;
            self.editOutlet = editOutlet;
            self.reset = reset;
            self.updateEmergencyContact = updateEmergencyContact;
            self.setTab = setTab;
            self.isSet = isSet;
            self.updateOutlet = updateOutlet;
            self.tab = 1;
            self.onlyNumbers = commonService.allowNumber;
            self.authorization = authorization;

            //Set the Tab for Active Outlet Details
            function setTab(tabId) {
                this.tab = tabId;
            };
            //Set the Tab for InActive Outlet Details
            function isSet(tabId) {
                return this.tab === tabId;
            };
            /**
             * Filed chooser
             * Based on the this filed chooser show and hide the column in a list.
             */
            self.fChooser_outlet = {
                'Branch_Id': true,
                'Branch_Name': true,
                'status': true,
                'Mobile_No': true,
                'Outlet_Type': true
            };
            // Initialize the all function,its load the entire page.
            function init() {
                getOutlets();
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
             * Get the all outlet  using data service passing the URL.
             * On success call getting all outlet details 
             * To filter the active state outlet details in a summary list
             * To filter the active state franchise branch details in a summary list
             * To concatenate the both active state details  shows the emergency contact list
             */
            function getOutlets() {
                return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.outlets = responseData;
                    self.activeOutlet = self.outlets.filter(function(outlet) {
                        return (outlet.outletStatus == 'Active');
                    });
                    var franchiseBranch = franchiseBranches.filter(function(franchisebranch) {
                        return (franchisebranch.status === 'Active');
                    });
                    self.emergencyDetails = self.outlets.concat(franchiseBranches);
                }
            }
            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }

            /**
             * Update the outlet details using data service passing the URL.
             * On success call getting all outlet details in a summary list.
             * @param outlet
             */
            function updateOutlet(outlet) {
                outlet.outletStatus = 'Active';
                dataService.updateData(url, outlet._id, outlet).then(successHandler, errorHandler); //passing the Update URL to dataService ,its sucesss returns the data

                function successHandler(responseData) {
                    init();
                    self.tab = 1;
                }
            }
            /**
             * Update the outlet details using data service passing the URL.
             * Its first check the outlet or franchise,its validate the ,
             * details and allow to update data.
             * On success call the intialize function.
             * @param outlet
             */
            function updateEmergencyContact(outlet) {
                if (!outletValidation(outlet))
                    return false;

                if (outlet.franchiseId != undefined) {
                    var url = '/api/franchisebranchs';
                    dataService.updateData(url, outlet._id, outlet).then(successHandler, errorHandler);

                } else {
                    var url = '/api/outlets';
                    dataService.updateData(url, outlet._id, outlet).then(successHandler, errorHandler);
                }

                function successHandler(responseData) {
                    init();
                }
            }
            /**
             * To set the outlet details in edit mode
             * @param outlet
             */
            function editOutlet(outlet) {
                data = angular.copy(outlet);
            }
            /**
             * Reset the outlet in the summary list
             * @param outlet
             */
            function reset(outlet) {
                outlet.emergencyContactName = data.emergencyContactName;
                outlet.emergencyMobileNo = data.emergencyMobileNo;
            }
            /**
             * Based on the id and branchId,update the delete status from the outlet.
             * If  franchise present in the franchise branch,its cannot be deleted and
             * its shows the warning messages.
             * @param id
             * @param branchId
             */
            function deleteOutlet(id, branchId) {
                ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                    var franchiseBranch = franchiseBranches.filter(function(franchisebranch) {
                        return ((franchisebranch.franchiseId === branchId));
                    });

                    if (franchiseBranch.length == 0) {
                        dataService.updateData(url, id, {
                            isActive: false
                        }).then(successHandler, errorHandler);

                    } else {
                        ksAlertService.warn("Franchise depends on the franchise branches");
                    }

                });

                function successHandler(responseData) {
                    ksAlertService.warn('Deleted successfully');
                    init();
                }
            }
            /**
             * Emergency Contact number validation
             * By getting all outlet and franchise details in form page while  updating,
             * outlet and franchise data validate the existing data and shows warning alert message. 
             * @param outlet
             */
            function outletValidation(outlet) {
                if (outlet.franchiseId != undefined) {
                    for (var i = 0; i < franchiseBranches.length; i++) {
                        var value = franchiseBranches[i];
                        if (value.branchId !== outlet.branchId && (value.emergencyCode === outlet.emergencyCode && value.emergencyMobileNo === outlet.emergencyMobileNo)) {
                            ksAlertService.warn("Emergency mobileNo already exists");
                            return false;
                        }
                    }

                } else {
                    for (var i = 0; i < self.outlets.length; i++) {
                        var value = self.outlets[i];
                        if (value.branchId !== outlet.branchId && (value.emergencyCode === outlet.emergencyCode && value.emergencyMobileNo === outlet.emergencyMobileNo)) {
                            ksAlertService.warn("Emergency mobileNo already exists");
                            return false;
                        }
                    }
                }
                return true;
            };
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
                    });;
            }

            init();
        }
    }());