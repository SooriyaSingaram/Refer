/**
 * Role Setup Controller
 */
(function() {

    'use strict';

    angular
        .module('configuration')
        .controller('roleSetupController', RoleSetupController)

    RoleSetupController.$inject = ['commonService', 'dataService', 'ksAlertService'];
    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires ksAlertService
     * @ngInject
     */
    function RoleSetupController(commonService, dataService, ksAlertService) {

        var self = this,
            url = '/api/roleSetups',
            data;

        self.roleSetup = {};
        //Get,Create,Edit,Delete Role Setup Details
        self.getRoleSetup = getRoleSetup;
        self.addRoleSetup = addRoleSetup;
        self.updateRoleSetup = updateRoleSetup;
        self.deleteRoleSetup = deleteRoleSetup;
        self.editRoleSetup = editRoleSetup;
        //Reset functions in form page
        self.resetData = resetData;
        self.reset = reset;
        // Setting the maximum number of pages in summary list
        self.isActiveValue = isActiveValue;

        // Initialize the all function,its load the entire page.
        function init() {
            getRoleSetup();
            self.availableLimits = commonService.paginationLimit();
        }
        /**
         * Set the count for a summary page.
         * @param count
         */
        function setValue(count) {
            commonService.setLimit(count);
        }
        /**
         * Initially show count for a summary page.
         * @param count
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }
        /**
         * To set the details in edit mode
         * @param roleSetup
         */
        function editRoleSetup(roleSetup) {
            data = angular.copy(roleSetup);
        };
        /**
         * Reset the values in the summary list
         * @param roleSetup
         */
        function resetData(roleSetup) {
            roleSetup.roleName = data.roleName;
            roleSetup.roleDescription = data.roleDescription;
            roleSetup.roleStatus = data.roleStatus;
        };
        /**
         * Get the all role setup details using data service passing the URL.
         * On success call getting all role setup details in a summary list
         */
        function getRoleSetup() {
            return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                self.roleSetups = responseData;
            }
        }
        // Handles the error while getting false function.
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Update the role setup details using data service passing the URL.
         * Its first validate the role setup details and allow to update data.
         * On success call getting all role setup details in a summary list.
         * @param roleSetup
         */
        function updateRoleSetup(roleSetup) {

            if (!roleSetupValidation(roleSetup))
                return false;

            dataService.updateData(url, roleSetup._id, roleSetup).then(successHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                getRoleSetup();
                self.reset();
            }
        }
        // Reseting the input field in a form.
        function reset() {
            self.roleSetup = null;
        }
        /**
         * Add the role setup details using data service passing the URL.
         * Its first validate the role setup details and allow to add data.
         * On success call getting all role setup details in a summary list.
         * @param roleSetup
         */
        function addRoleSetup(roleSetup) {

            if (!roleSetupValidation(roleSetup))
                return false;

            dataService.saveData(url, roleSetup).then(successHandler, errorHandler); //passing the POST URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                getRoleSetup();
                self.reset();
            }
        }
        /**
         * Based on the Id,delete the data from the role setup.
         * @param id
         */
        function deleteRoleSetup(id) {
            ksAlertService.confirm("Do you want to delete the clicked item ?").then(function() {
                dataService.updateData(url, id, { //passing the UPDATE URL into dataService,while its sucesss will returns the data
                    isActive: false
                }).then(successHandler, errorHandler);
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                init();
            }
        }
        /**
         * By getting all role setup details in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param roleSetup
         */
        function roleSetupValidation(roleSetup) {
            for (var i = 0; i < self.roleSetups.length; i++) {
                var value = self.roleSetups[i];
                if (roleSetup._id === undefined) {

                    if (value.roleName.toLowerCase() === roleSetup.roleName.toLowerCase()) {
                        ksAlertService.warn("Role name already exists");
                        return false;
                    }
                } else {
                    if (value.roleId !== roleSetup.roleId && (value.roleName.toLowerCase() === roleSetup.roleName.toLowerCase())) {
                        ksAlertService.warn("Role name already exists");
                        return false;
                    }
                }
            }
            return true;
        }
        init();
    }

}());