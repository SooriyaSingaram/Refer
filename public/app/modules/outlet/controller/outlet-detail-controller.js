    /**
     * Outlet Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('outlet')
            .controller('outletDetailController', OutletDetailController)
        OutletDetailController.$inject = ['commonService', 'dataService', '$filter', 'countryCodes', 'franchiseBranches', '$state', 'ksAlertService'];

        /**
         * @memberof module:outlet
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $filter
         * @requires countryCodes
         * @requires franchiseBranches
         * @requires $state
         * @requires ksAlertService
         * @ngInject
         */

        function OutletDetailController(commonService, dataService, $filter, countryCodes, franchiseBranches, $state, ksAlertService) {
            var self = this,
                url = '/api/outlets',
                data;

            self.outlet = {};
            //Add & Remove the Storage Locations
            self.addStorageArea = addStorageArea;
            self.removeStorageArea = removeStorageArea;
            self.formValidation = commonService.formValidation;
            self.disableSubmit = disableSubmit;
            //Get,Create,Edit Outlet Details
            self.getOutletDetails = getOutletDetails;
            self.addOutlet = addOutlet;
            self.updateOultlet = updateOultlet;
            self.getallOutlets = getallOutlets;
            self.outletTypeValidation = outletTypeValidation;
            self.statusValidation = statusValidation;
            //Outlet Validations
            self.outletValidation = outletValidation;
            self.checkStorageDetails = checkStorageDetails;
            //Reset Function
            self.reset = reset;
            self.onlyNumbers = commonService.allowNumber;

            // Initialize the all function,its load the entire page.
            function init() {
                getOutletDetails();
                getallOutlets();
                self.countryCodes = countryCodes;
            }
            /**
             * Onloading of the page get the data and copy it.
             * @param outlet
             */
            function setData(outlet) {
                data = outlet;
                self.outlet = angular.copy(data);
            }
            // Reset the data in the form
            function reset() {
                setData(data);
            }
            /**
             * To get the storagedetails and create the new storage area
             * @param storageDetails
             */
            function addStorageArea(storageDetails) {
                storageDetails.push({
                    storageArea: ''
                });
            }
            /**
             * To get the storagedetails and remove the stroageArea
             * @param storageDetails
             * @param index
             */
            function removeStorageArea(storageDetails, index) {
                storageDetails.splice(index, 1);
            }
            /**
             * Based on the State get the id and checks the Edit mode or not.
             * If its editmode,to passing the URL get the particular outlet detail.
             */
            function getOutletDetails() {
                self.isEditmode = commonService.isEditMode();
                if (self.isEditmode === true) {
                    commonService.getDataById(url).then(function(outlet) {
                        setData(outlet);
                    });
                } else {
                    setData({});
                }
            }
            //On click function to change the status of the button
            function disableSubmit() {
                self.submitbut = false;
            }
            /**
             * Checks the stroage Details and if its not present create the,
             * new Storagearea.
             * @param outletType
             */
            function checkStorageDetails(outletType) {
                outletType.storageDetails = [];
                self.addStorageArea(outletType.storageDetails);
            }
            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }
            /**
             * Update the outlet details using data service passing the URL.
             * It's first validate the outlet details and allow to update data.
             * On success call getting all outlet details in a summary list.
             * @param outlet
             */
            function updateOultlet(outlet) {
                if (!outletValidation(outlet))
                    return false;

                dataService.updateData(url, outlet._id, outlet).then(successHandler, errorHandler); //passing the Update URL to dataService ,its sucesss returns the data

                function successHandler(responseData) {
                    $state.go('root.outlet-list');
                }
            }
            /**
             * Add the outlet details using data service passing the URL.
             * Its first validate the outlet details and allow to add data.
             * On success call getting all outlet details in a summary list.
             * @param outlet
             */
            function addOutlet(outlet) {

                if (!outletValidation(outlet))
                    return false;
                dataService.saveData(url, outlet).then(successHandler, errorHandler); //passing the  POST URL to dataService ,its sucesss returns the data

                function successHandler(responseData) {
                    $state.go('root.outlet-list');
                }
            }
            /**
             * Get the all outlet details using data service passing the URL.
             * On success call getting all outlet details 
             * To filter the active state outlet details in a summary list
             */
            function getallOutlets() {

                return dataService.getData(url).then(successHandler, errorHandler); //passing the Get URL to dataService,its sucesss returns the data

                function successHandler(responseData) {
                    self.outlets = responseData;
                    self.activeOutlet = self.outlets.filter(function(outlet) {
                        return (outlet.outletStatus == 'Active');
                    });

                }
            }
            /**
             * By getting all active state outlet details in form page while select the outlettype,
             * outlet data checks the existing data if its presents the more then one warehouse or one centralized Kitchen,
             * which its shows warning alert message. 
             * @param outlet
             */
            function outletTypeValidation(outlet) {
                if ((outlet.outletType.outletType === 'Ware House') || (outlet.outletType.outletType === 'Centralized Kitchen')) {
                    var wareHouseCount = 0,
                        CentralizedCount = 0;
                    for (var i = 0; i < self.activeOutlet.length; i++) {
                        var value = self.activeOutlet[i];
                        if (value.outletType.outletType === 'Ware House') {
                            wareHouseCount++;
                        }
                        if (value.outletType.outletType === 'Centralized Kitchen') {
                            CentralizedCount++;
                        }
                    }
                    if ((outlet.outletType.outletType === 'Ware House') && (wareHouseCount == 1)) {
                        ksAlertService.warn("Ware house already exists");
                        outlet._id != undefined ? outlet.outletType.outletType = data.outletType.outletType : outlet.outletType.outletType = '';

                    }

                    if ((outlet.outletType.outletType === 'Centralized Kitchen') && (CentralizedCount == 1)) {
                        ksAlertService.warn("Centralized kitchen already exists");
                        outlet._id != undefined ? outlet.outletType.outletType = data.outletType.outletType : outlet.outletType.outletType = '';
                    }

                }
            }
            /**
             * To get the outlet value and its allow only the franchise and status is inactive,
             * it checks if any active state franchise branch are present in  franchise ,
             * its shows the warning message.
             * @param outlet
             */
            function statusValidation(outlet) {
                var franchiseBranch;

                if ((outlet.outletType.outletType === 'Franchise') && (outlet.outletStatus === 'Inactive') && (outlet.branchId != undefined)) {

                    franchiseBranch = franchiseBranches.filter(function(franchisebranch) {
                        return ((franchisebranch.franchiseId === outlet.branchId) && (franchisebranch.status == 'Active'));
                    });

                    if (franchiseBranch.length >= 1) {
                        ksAlertService.warn("Status cannot be changed");
                        outlet.outletStatus = 'Active';
                    }
                }
            }
            /**
             * By getting all  active state outlet details in form page while adding or updating,
             * outlet data validate the existing data and shows warning alert message. 
             * @param outlet
             */
            function outletValidation(outlet) {
                for (var i = 0; i < self.activeOutlet.length; i++) {
                    var value = self.activeOutlet[i];
                    if (outlet._id === undefined) {
                        if (value.code === outlet.code && value.mobileNo === outlet.mobileNo) {
                            ksAlertService.warn("MobileNo already exists");
                            return false;
                        }
                    } else {
                        if (value.branchId !== outlet.branchId && (value.code === outlet.code && value.mobileNo === outlet.mobileNo)) {
                            ksAlertService.warn("MobileNo already exists");
                            return false;
                        }
                    }
                }
                return true;
            };
            init();
        }
    }());