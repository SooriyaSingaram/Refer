/**
 * Employee List Controller
 * @Hrm Module
 */
(function() {

    'use strict';

    angular
        .module('hrm')
        .controller('employeeListController', EmployeeListController)


    EmployeeListController.$inject = ['dataService', 'commonService', '$state', 'ksAlertService', 'outlets','franchise', 'role', 'auth'];
    /**
     *controller for Listing all the Employees.
     *
     * @memberOf module:hrm
     *
     * @requires  $state   
     * @requires  ksAlertService
     * @requires  outlets
     * @requires  role
     */
    function EmployeeListController(dataService, commonService, $state, ksAlertService, outlets,franchise, role, auth) {

        var self = this,
            url = '/api/employees';
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteEmployee = deleteEmployee;
        self.outlets = outlets;
        self.role = role;
        self.authorization=authorization;
        /**
         * Field Chooser for grid
         * grid shows initially  following fields   
         */
        self.fChooser_employee = {
            'Employee_Id': true,
            'Employee_Name': true,
            'user_Name': true,
            'Branch1': true,
            'Role_Name': true,
            'status': true
        };
        /**
         * Initialize the functions while loading controller
         * Listing all the employees in active status
         */
        function init() {
            getEmployees();
            self.availableLimits = commonService.paginationLimit();
            authorization();
        }
        /**
         * Set limit for showing employee list
         * @param {String} amount - selected amount of entries to be shown in employee list
         */
        function setValue(count) {
            commonService.setLimit(count);
        }
        /**
         * Initial limit for showing employee list
         * @param {String} amount - Initialy set amount of employees shown in the list 
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }

        /**
         * Get All the Employees using data service by passing Url
         */
        function getEmployees() {
            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                self.employees = responseData;
                angular.forEach(responseData, function(employee, key) {
                    var branch = outlets.filter(function(branch) {
                        return (employee.branchId == branch.branchId);
                    });
                    var franchiseBranch = franchise.filter(function(branch) {
                        return (employee.branchId == branch.branchId);
                    });
        if(branch[0]){
            employee.branchName =  branch[0].branchName;
        }
        else if(franchiseBranch[0]){
            employee.branchName =  franchiseBranch[0].branchName;
        }
        else{
             employee.branchName = "All Branches"
        }
                })
            }
        }
        /**
         * Delete Particular Employee
         * @param {String} id,employeeId - Particular Employee status updated to inactive based on id.
         */
        function deleteEmployee(id, employeeId) {
            ksAlertService.confirm("Do you want to delete the clicked item ?").then(function() {
                dataService.updateData(url, id, {
                    isActive: false
                }).then(successHandler);

            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                init();
            }
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running employee list controller
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