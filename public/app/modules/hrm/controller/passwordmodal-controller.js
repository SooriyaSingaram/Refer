/**
 * Password Modal Controller
 * @Hrm Module
 */
(function() {

    'use strict';

    angular
        .module('hrm')
        .controller('passwordModalController', PasswordModalController)

    PasswordModalController.$inject = ['commonService', 'dataService', '$state', 'ksAlertService'];
    /**
     *controller for Change password popup modal. 
     * 
     * @memberOf module:hrm
     * @requires commonService
     * @requires dataService
     * @requires $state
     * @requires ksAlertService 
     */
    function PasswordModalController(commonService, dataService, $state, ksAlertService) {

        var self = this,
            url = '/api/employees',
            data;
        self.employee = {};
        self.getEmployeeDetails = getEmployeeDetails;
        self.updateEmployee = updateEmployee;
        self.formValidation = commonService.formValidation;

        /**
         * Initialize the functions while loading controller
         */
        function init() {
            getEmployeeDetails();
        }
        /**
         * Get the employee details based on Id using data service by passing the URL.
         * 
         */
        function getEmployeeDetails() {
            commonService.getDataById(url).then(function(employee) {
                self.employee = employee;
            });

        }
        /**
         * Update Employee Password using data service passing the URL.
         * @param {String} employee Employee detail to update
         */
        function updateEmployee(employee) {
            dataService.updateData(url, employee._id, employee).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.employee-list');
            }
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while loading password controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());