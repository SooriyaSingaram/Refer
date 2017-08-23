/**
 * Daily Occurrences Detail Controller
 * @Outlet Module
 */
(function() {

    'use strict';

    angular
        .module('outlet')
        .controller('dailyOccurrencesController', DailyOccurrencesController)

    DailyOccurrencesController.$inject = ['commonService', 'dataService', 'complaints', 'franchise', 'outlets', '$state', 'auth', 'roles'];
    /**
     * controller for Daily Occurrence 
     * @memberOf module:outlet
     *
     * @requires commonService
     * @requires dataService
     * @requires complaints
     * @requires employees
     * @requires outlets
     * @requires $state
     */
    function DailyOccurrencesController(commonService, dataService, complaints, franchise, outlets, $state, auth, roles) {

        var self = this,
            url = '/api/dailyoccurrences',
            data, userId, branchId;

        self.dailyOccurrence = {};
        self.disableSubmit = disableSubmit;
        self.getDailyOccurrenceDetails = getDailyOccurrenceDetails;
        self.addDailyOccurrence = addDailyOccurrence;
        self.updateDailyOccurrence = updateDailyOccurrence;
        self.reset = reset;
        self.formValidation = commonService.formValidation;
        /**
         * Initialize the functions while loading controller
         */
        function init() {
            self.franchise=franchise;
            self.outlet = outlets.concat(franchise);
            self.franchiseOutlet= outlets.filter(function(outlet) {
                return (outlet.outletType.outletType == "Franchise");
            });
           self.franchiseBranch =self.franchiseOutlet.concat(franchise); 
            getDailyOccurrenceDetails();
            getUserRole();
            self.complaints = complaints;
            self.auth = auth;
        }
        /**
         * Reset all form fields to their default values 
         * @param {String} employee Employee values to form field
         */
        function reset() {
            setData(data);
        }
        /**
         * Copy form data if values are available 
         * @param {String} dailyOccurrence Daily Occurrence values set to form field
         */
        function setData(dailyOccurrence) {
            data = dailyOccurrence;
            self.dailyOccurrence = angular.copy(data);
        }

        /**
         * Get the daily occurrence details based on Id using data by service passing the URL.
         * @param {String} dailyOccurrence Daily Occurrence values set to form field
         * Auto binding branch name based on login user 
         */
        function getDailyOccurrenceDetails() {
            self.isEditmode = commonService.isEditMode();

            if (self.isEditmode) {
                commonService.getDataById(url).then(function(dailyOccurrence) {
                    setData(dailyOccurrence);

                });

            } else {
                getUserRole()
            }

        }
        /**
         * enable form field on click the edit button
         */
        function disableSubmit() {
            self.submitbut = false;
        }
        /**
         * Update particular Daily Occurrence detail using data service passing the URL.
         * @param {String} dailyOccurrence -to update Daily Occurrence detail
         */
        function updateDailyOccurrence(dailyOccurrence) {
            dailyOccurrence.reportedBy = auth.employeeId;;
            dataService.updateData(url, dailyOccurrence._id, dailyOccurrence).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.daily-occurrences-list');
            }

        }
        /**
         * Create Daily Occurrence detail using data service passing the URL.
         * @param {String} dailyOccurrence Daily Occurrence detail to add
         */
        function addDailyOccurrence(dailyOccurrence) {
            dailyOccurrence.reportedBy = auth.employeeId;
            var branchDetails = outlets.concat(franchise);
            var branch = branchDetails.filter(function(branch) {
                return (branch.branchId == dailyOccurrence.outletId);
            });
            var franchiseDetails = {};
            if ((branch[0].outletType != undefined) && (branch[0].outletType.outletType === 'Franchise')) {
                franchiseDetails.franchise = true;
                franchiseDetails.franchiseId = branch[0].branchId;
            }
            if (branch[0].franchiseId != undefined) {
                franchiseDetails.franchise = true;
                franchiseDetails.franchiseId = branch[0].franchiseId;
            }
            self.dailyOccurrence.franchise = franchiseDetails;

            self.dailyOccurrence.branchName = branch[0].branchName;

            dataService.saveData(url, dailyOccurrence).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.daily-occurrences-list');
            }
        }
        /**
         * get User Role using roles and auth.
         * get branch detail  based on role 
         */
        function getUserRole() {
            self.loginUser = roles.filter(function(role) {
                return (role.roleId == auth.role);
            });
            if (self.loginUser[0].roleId != 'KS_RS001') {
            self.dailyOccurrence.outletId=auth.branchId;
                }
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running employee list controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }

}());