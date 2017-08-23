/**
 * Employee Detail Controller
 * @Employee Module
 */
(function() {

    'use strict';

    angular
        .module('hrm')
        .controller('employeeDetailController', EmployeeDetailController)

    EmployeeDetailController.$inject = ['commonService', 'dataService', 'configuration', 'role', 'franchise', 'outlets', '$state', 'ksAlertService', 'countryCodes', '$uibModal'];
    /**
     * controller for Employee Profile Creation. 
     * 
     * @memberOf module:hrm
     *
     * @requires commonService
     * @requires dataService
     * @requires configuration
     * @requires role 
     * @requires outlets 
     * @requires $state
     * @requires ksAlertService
     * @requires countryCodes
     * @requires $modal
     */
    function EmployeeDetailController(commonService, dataService, configuration, role, franchise, outlets, $state, ksAlertService, countryCodes, $modal) {

        var self = this,
            url = '/api/employees',
            data;

        self.inactive = true;
        self.employee = {};
        self.disableSubmit = disableSubmit;
        self.passwordModal = passwordModal;
        self.getEmployeeDetails = getEmployeeDetails;
        self.addEmployee = addEmployee;
        self.updateEmployee = updateEmployee;
        self.reset = reset;
        self.formValidation = commonService.formValidation;
        self.onlyNumbers = commonService.allowNumber;
        self.filterRole = filterRole;
        self.allOutlet = true;

        /**
         * Initialize the functions while loading controller
         */
        function init() {

            getEmployees();
            getEmployeeDetails();
            self.configuration = configuration[0];
            self.role = role;
            self.outlets = outlets;
            self.franchise = franchise;
            self.totalOutlet=outlets.concat(franchise);
            var allOutletBrnch = [{'branchId': "All Branches",'branchName': "All Branches"}];
            self.allOutlets= self.totalOutlet.concat(allOutletBrnch); 
            self.countryCodes = countryCodes;
            self.outletTypes = outlets.filter(function(branch) {
                return (branch.outletType.outletType == 'Outlet');
            });
            self.franchiseTypes = outlets.filter(function(branch) {
                return (branch.outletType.outletType == 'Franchise');
            });

            self.ckBranch = outlets.filter(function(branch) {
                return (branch.outletType.outletType == 'Centralized Kitchen');
            });
            self.whBranch = outlets.filter(function(branch) {
                return (branch.outletType.outletType == 'Ware House');
            });
        }
        /**
         * Reset all form fields to their default values 
         */
        function reset() {
            setData(data);
        }
        /**
         * filter role based on outlet type 
         */

        function filterRole(systemRole, branch) {
            if (branch !== undefined) {
                self.employee.branchId = '';
            }

            if (['KS_RS001', 'KS_RS002', 'KS_RS003','KS_RS006'].indexOf(systemRole) > -1) {
                self.allBranch = true;
                self.outletBranch = false;
                self.franchiseType = false;
                self.franchiseBranchType = false;
                self.ckType = false;
                self.whType = false;
                 self.allOutlet = false;
            }
             if (systemRole == 'KS_RS004') {
                self.whType = true;
                self.outletBranch = false;
                self.allBranch = false;
                self.franchiseType = false;
                self.franchiseBranchType= false;
                self.ckType = false;
                self.allOutlet = false;  
            }
            if (systemRole == 'KS_RS005') {
                self.ckType = true;
                self.outletBranch = false;
                self.allBranch = false;
                self.franchiseType = false;
                self.franchiseBranchType = false;
                self.whType = false;
                self.allOutlet = false;
            }

            if (systemRole == 'KS_RS009') {
                self.franchiseType =  true;
                self.allBranch = false;
                self.franchiseBranchType =false;
                self.outletBranch = false;
                self.ckType = false;
                self.whType = false;
                self.allOutlet = false;
            }
            if (systemRole == 'KS_RS007') {
                self.outletBranch = true;
                self.ckType = false;
                self.whType = false;
                self.allBranch = false;
                self.franchiseType = false;
                self.franchiseBranchType = false;
                self.allOutlet = false;
            }
            if (systemRole == 'KS_RS008') {
                self.franchiseBranchType = true;
                self.franchiseType = false;
                self.outletBranch = false;
                self.allBranch = false;
                self.ckType = false;
                self.whType = false;
                self.allOutlet = false;
            }

        }
        /**
         * Copy form data if values are available 
         * @param {String} employee Employee values set to form field
         */
        function setData(employee) {
            data = employee;
            self.employee = angular.copy(data);
        }
        /**
         * Get the all Employee details using data service passing the URL.
         * @returns All avaliable employee details
         */
        function getEmployees() {

            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                self.employees = responseData;
            }
        }
        /**
         * Get the employee details based on Id using data by service passing the URL.
         * 
         */
        function getEmployeeDetails() {

            self.isEditmode = commonService.isEditMode();

            if (self.isEditmode) {
                commonService.getDataById(url).then(function(employee) {
                    setData(employee);
                });
            } else {
                setData({});
            }
        }
        /**
         * enable form field on click the edit button
         */
        function disableSubmit() {
            self.submitbut = false;
        }
        /**
         * Update particular Employee detail using data service passing the URL.
         * @param {String} employee - to update Employee detail 
         */
        function updateEmployee(employee) {

            if (!employeeValidation(employee))
                return false;

            dataService.updateData(url, employee._id, employee).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.employee-list');
            }

        }
        /**
         * Create Employee detail using data service passing the URL.
         * @param {String} employee Employee detail to add
         */
        function addEmployee(employee) {
            if (!employeeValidation(employee))
                return false;

            dataService.saveData(url, employee).then(successHandler, errorHandler);

            function successHandler(responseData) {
                $state.go('root.employee-list');
            }
        }
        /**
         * Validate Email Duplicate Entry
         * Validate Mobile Number Duplicate Entry
         * @param {String} employee Employee detail to validate 
         */
        function employeeValidation(employee) {

            for (var i = 0; i < self.employees.length; i++) {
                var value = self.employees[i];
                if (employee._id === undefined) {

                    if (value.code === employee.code && value.phoneNo === employee.phoneNo) {
                        ksAlertService.warn("MobileNo already exists");
                        return false;
                    }
                    if (employee.userName == "admin@gmail.com") {
                        ksAlertService.warn("Email already exists");
                        return false;
                    }
                    if (value.userName === employee.userName) {
                        ksAlertService.warn("Email already exists");
                        return false;
                    }
                } else {
                    if (value.employeeId !== employee.employeeId && (value.code === employee.code && value.phoneNo === employee.phoneNo)) {
                        ksAlertService.warn("Mobile no already exists");
                        return false;
                    }
                    if (value.employeeId !== employee.employeeId && value.userName === employee.userName) {
                        ksAlertService.warn("Email already exists");
                        return false;
                    }

                }

            }
            return true;

        }
        /**
         * Show popup modal for change Password
         * @param {String} employee Employee detail to bind in modal
         * @requires $modal 
         */
        function passwordModal(employees) {
            $modal.open({
                templateUrl: 'app/modules/hrm/view/passwordmodal.html',
                controller: 'passwordModalController',
                controllerAs: 'pmc'
            })
        };
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running employee detail controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }

}());