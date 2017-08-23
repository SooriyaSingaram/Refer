    /**
     * Franchise Branch Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('outlet')
            .controller('franchiseBranchDetailController', FranchiseBranchDetailController)

        FranchiseBranchDetailController.$inject = ['commonService', 'dataService', '$filter', 'countryCodes', '$state', 'ksAlertService', 'outlets'];

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
         * @ngInject
         */
        function FranchiseBranchDetailController(commonService, dataService, $filter, countryCodes, $state, ksAlertService, outlets) {
            var self = this,
                url = '/api/franchisebranchs',
                data;

            self.franchiseBranch = {};
            self.addStorageArea = addStorageArea;
            self.removeStorageArea = removeStorageArea;
            self.formValidation = commonService.formValidation;
            self.disableSubmit = disableSubmit;
            self.getFranchiseBranchDetails = getFranchiseBranchDetails;
            self.editFranchiseBranchDetails = editFranchiseBranchDetails;
            self.addFranchiseBranchDetail = addFranchiseBranchDetail;
            self.updateFranchiseBranchDetail = updateFranchiseBranchDetail;
            self.onlyNumbers = commonService.allowNumber;
            self.reset = reset;

            //Initialize the all function,its load the entire page.
            function init() {
                getFranchiseBranchDetails();
                editFranchiseBranchDetails();
                getFranchiseDetails();
                self.countryCodes = countryCodes;
            }
            /**
             * Onloading of the page get the data and copy it and check the stroagedetails
             * @param franchiseBranch
             */
            function setData(franchiseBranch) {
                data = franchiseBranch;
                self.franchiseBranch = angular.copy(data);
                checkStorageDetails();
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
            //To filter the active state,franchises in outlets
            function getFranchiseDetails() {
                self.franchises = outlets.filter(function(outlet) {
                    return (outlet.outletStatus == 'Active' && outlet.outletType.outletType === 'Franchise');
                });
            }
            /**
             * Based on the State get the id and checks the Edit mode or not.
             * If its editmode,to passing the URL get the particular franchise branch detail.
             */
            function editFranchiseBranchDetails() {
                self.isEditmode = commonService.isEditMode();
                if (self.isEditmode === true) {
                    commonService.getDataById(url).then(function(franchiseBranch) {
                        self.franchiseBranch = franchiseBranch;
                        setData(franchiseBranch);
                    });
                } else {
                    setData({});
                    checkStorageDetails();
                }
            }

            //On click function to change the status of the button
            function disableSubmit() {
                this.submitbut = false;
            }
            /**
             * Checks the stroage Details and if its not present create the,
             * new Storagearea.
             */
            function checkStorageDetails() {
                if (self.franchiseBranch && !self.franchiseBranch.storageDetails) {
                    self.franchiseBranch.storageDetails = [];
                    self.addStorageArea(self.franchiseBranch.storageDetails);
                }
            }
            /**
             * Get the all franchise branch details using data service passing the URL.
             * On success call getting all franchise branch details 
             * To filter the active state franchise branch details in a summary list
             */
            function getFranchiseBranchDetails() {
                dataService.getData(url).then(successHandler, errorHandler); //passing the Get URL to dataService,its sucesss returns the data
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
             * Update the franchise branch details using data service passing the URL.
             * It's first validate the franchise branch details and allow to update data.
             * On success call getting all franchise branch details in a summary list.
             * @param franchiseBranch
             */
            function updateFranchiseBranchDetail(franchiseBranch) {
                if (!franchiseBranchValidation(franchiseBranch))
                    return false;
                dataService.updateData(url, franchiseBranch._id, franchiseBranch).then(successHandler, errorHandler); //passing the Update URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    $state.go('root.franchise-branch-list');
                }
            }
            /**
             * Add the franchise branch details using data service passing the URL.
             * Its first validate the franchise branch details and allow to add data.
             * On success call getting all franchise branch details in a summary list.
             * @param franchiseBranch
             */
            function addFranchiseBranchDetail(franchiseBranch) {
                if (!franchiseBranchValidation(franchiseBranch))
                    return false;
                dataService.saveData(url, franchiseBranch).then(successHandler, errorHandler); //passing the  POST URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    init();
                    $state.go('root.franchise-branch-list');
                }
            }
            /**
             * By getting all franchise branch details in form page while adding or updating,
             * franchise data validate the existing data and shows warning alert message. 
             * @param franchiseBranch
             */
            function franchiseBranchValidation(franchiseBranch) {
                for (var i = 0; i < self.activeFranchiseBranchs.length; i++) {
                    var value = self.activeFranchiseBranchs[i];
                    if (franchiseBranch._id === undefined) {
                        if (value.code === franchiseBranch.code && value.mobileNo === franchiseBranch.mobileNo) {
                            ksAlertService.warn("MobileNo already exists");
                            return false;
                        }
                    } else {
                        if (value.branchId !== franchiseBranch.branchId && (value.code === franchiseBranch.code && value.mobileNo === franchiseBranch.mobileNo)) {
                            ksAlertService.warn("MobileNo already exists");
                            return false;
                        }
                    }
                }
                return true;
            }
            init();
        }
    }());