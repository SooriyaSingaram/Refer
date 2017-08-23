/**
 * Daily Occurrences List Controller
 * @Outlet Module
 */
(function() {

    'use strict';

    angular
        .module('outlet')
        .controller('dailyOccurrencesListController', DailyOccurrencesListController)

    DailyOccurrencesListController.$inject = ['dataService', 'commonService', '$state', 'ksAlertService', 'complaints', 'outlets', 'franchises', '$filter', 'auth'];
    /**
     *controller for Listing all the Requests.
     * @memberOf module:outlet
     * @requires dataService
     * @requires commonService
     * @requires $state
     * @requires ksAlertService
     * @requires complaints
     * @requires outlets
     * @requires $filter
     */
    function DailyOccurrencesListController(dataService, commonService, $state, ksAlertService, complaints, outlets, franchises, $filter, auth) {

        var self = this,
            data,
            url = '/api/dailyoccurrences';
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deleteDailyOccurrence = deleteDailyOccurrence;
        self.getUtcDate = getUtcDate;
        self.print = commonService.print;
        self.downloadPdf = commonService.downloadPdf;
        self.filterByDetails = filterByDetails;
        self.reset = reset;
        self.authorization = authorization;
        /**
         * Field Chooser for grid
         * grid shows initially  following fields   
         */
        self.fChooser_dailyOccurrence = {
            'outlet_id': true,
            'outlet_name': true,
            'reported_date': true,
            'complaints': true,
            'reported_by': true
        };
        /**
         * get Utc date format to filter the grid values by date
         * @params date 
         */
        function getUtcDate(date) {
            self.reportDate = date.toISOString()
        }
        /**
         * Initialize the functions while loading controller
         * Listing all the Daily Occurrences
         */
        function init() {
            getDailyOccurrences();
            self.availableLimits = commonService.paginationLimit();
            self.branchInformation = getFranchiseDetails();
            self.complaints = complaints;
            authorization();
        }
        /**
         * Set limit for showing Daily Occurrences list
         * @param {String} limit - selected count of entries to be shown in Daily Occurrences list
         */
        function setValue(amount) {
            commonService.setLimit(amount);
        }
        /**
         * Initial limit for showing daily occurrence list
         * @param {String} limit - Initialy set the limit of Daily Occurrences shown in the list 
         */
        function isActiveValue(amount) {
            commonService.isActiveLimit(amount);
        }
        //Get the franchise Details
        function getFranchiseDetails() {
            var details;
            if (auth.role === 'KS_RS006') {
                details = outlets.filter(function(outlet) {
                    return (outlet.outletType.outletType === 'Franchise');
                });
                return details.concat(franchises);
            } else {
                return outlets.concat(franchises);
            }
        }
        /**
         * Get branchName details
         * @param dailyOccurrenceDetails
         */
        function getBranchName(dailyOccurrenceDetails) {
            self.branchDetails = outlets.concat(franchises);
            angular.forEach(dailyOccurrenceDetails, function(dailyOccurrenceDetail) {
                var branchData = self.branchDetails.filter(function(branchDetail) {
                    console.log(branchDetail);
                    return (dailyOccurrenceDetail.outletId === branchDetail.branchId);
                });
                dailyOccurrenceDetails.branchName = branchData[0].branchName;
            })
            return dailyOccurrenceDetails;
        }

        /**
         * Get All the Requests using data service by passing Url
         */
        function getDailyOccurrences() {
            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                self.dailyOccurrences = getBranchName(responseData);
                console.log(self.dailyOccurrences);
                data = angular.copy(responseData);
            }
        }
        /**
         * Delete Particular DailyOccurrence
         * @param {String} id,dailyOccurrenceId - Particular daily occurrence status updated to inactive based on id.
         */
        function deleteDailyOccurrence(id, dailyOccurrenceId) {
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
         * @param {String} e - displaying error notification while running request list controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * filter the data based on the from and to date 
         * @param dailyOccurrence
         */
        function filterByDetails(dailyOccurrence) {
            var dailyOccurrenceDetails = [];
            $filter('filter')(data, function(v) {
                var itemDate = new Date(v.reportDate);
                itemDate.setHours(0, 0, 0, 0);
                var date = moment(itemDate);
                if (date >= moment(new Date(dailyOccurrence.fromDate)) && date <= moment(new Date(dailyOccurrence.toDate)) && (v.outletId === dailyOccurrence.outletId) && (v.complaintId === dailyOccurrence.complaintId)) {

                    dailyOccurrenceDetails.push(v);
                }
            });
            self.dailyOccurrences = getBranchName(dailyOccurrenceDetails);
        }
        //Reset the data in the form
        function reset() {
            self.dailyOccurrences = data;
            self.dailyOccurrence.fromDate = null;
            self.dailyOccurrence.toDate = null;
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