/**
 * Complaint Type Controller
 */
(function() {
    'use strict';
    angular
        .module('configuration')
        .controller('complaintTypeController', ComplaintTypeController)

    ComplaintTypeController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService'];

    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @ngInject
     */
    function ComplaintTypeController(commonService, dataService, $filter, ksAlertService) {

        var self = this,
            data = {},
            url = "/api/complainttypes";

        self.getComplaintType = getComplaintType;
        self.addComplaintType = addComplaintType;
        self.editComplaintType = editComplaintType;
        self.updateComplaintType = updateComplaintType;
        self.deleteComplaintType = deleteComplaintType;
        self.complaintType = null;
        self.reset = reset;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page
        function init() {
            getComplaintType();
            self.availableLimits = commonService.paginationLimit();
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
         * Get the all complaint type details using data service passing the URL.
         * On success call getting all complaint type details in a summary list
         */
        function getComplaintType() {
            return dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.complaintTypes = responseData;
            }
        }

        // Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Add the complaint type details using data service passing the URL.
         * Its first validate the complaint type details and allow to add data.
         * On success call getting all complaint type details in a summary list.
         * @param complaintType
         */
        function addComplaintType(complaintType) {
            if (!complaintTypeValidation(complaintType))
                return false;
            dataService.saveData(url, complaintType).then(successHandler, errorHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getComplaintType();
                self.complaintType = null;
            }
        }
        /**
         * To set the complaintType details in edit mode
         * @param complaintType
         */
        function editComplaintType(complaintType) {
            data = angular.copy(complaintType);
        }
        /**
         * Update the complaint type details using data service passing the URL.
         * It's first validate the complaint type details and allow to update data.
         * On success call getting all complaint type details in a summary list.
         * @param complaintType
         */
        function updateComplaintType(complaintType) {
            if (!complaintTypeValidation(complaintType))
                return false;
            dataService.updateData(url, complaintType._id, complaintType).then(successHandler, errorHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getComplaintType();
            }
        }
        /**
         * Based on the id ,update the delete status from the complainttypes.
         * It displays the confirmation message.if it click Yes,delete the data in a summary list.
         * @param id
         */
        function deleteComplaintType(id) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                dataService.updateData(url, id, {
                    isActive: false
                }).then(successHandler);
            });
            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getComplaintType();
            }
        }
        /**
         * Reset the complaintType in the summary list
         * @param complaintType
         */
        function reset(complaintType) {
            complaintType.complaintName = data.complaintName;
        }
        /**
         * By getting all complaint type details in form page while adding or updating,
         * complaint type data validate the existing data and shows warning alert message. 
         * @param complaintType
         */
        function complaintTypeValidation(complaintType) {
            for (var i = 0; i < self.complaintTypes.length; i++) {
                var value = self.complaintTypes[i];
                if (complaintType._id === undefined) {
                    if (value.complaintName.toLowerCase() === complaintType.complaintName.toLowerCase()) {
                        reset(complaintType);
                        ksAlertService.warn("ComplaintName already exists");
                        return false;
                    }
                } else {
                    if (value.complaintId !== complaintType.complaintId && (value.complaintName.toLowerCase() === complaintType.complaintName.toLowerCase())) {
                        reset(complaintType);
                        ksAlertService.warn("ComplaintName already exists");
                        return false;
                    }
                }
            }
            return true;
        }

        init();
    }

}());