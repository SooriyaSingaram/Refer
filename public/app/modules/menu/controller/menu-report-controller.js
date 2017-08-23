/**
 * menu-report-controller
 */
(function() {
    'use strict';
    angular
        .module('menu')
        .controller('menuReportController', MenuReportController)
    MenuReportController.$inject = ['dataService', 'commonService', '$filter', 'menuReport'];
    /**
     * @memberof module:menu
     *
     * CRUD application is performed and also displays the data
     * @requires dataService
     * @requires commonService
     * @requires $filter
     * @requires menuReport
     * @ngInject 
     */
    function MenuReportController(dataService, commonService, $filter, menuReport) {
        var self = this,
            menuData;

        //Pagination
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.filterByMenu = filterByMenu;
        self.filterByTopMenu = filterByTopMenu
        self.reset = reset;
        self.print = commonService.print;
        self.downloadPdf = commonService.downloadPdf;
        self.filterByMonth = filterByMonth;

        /**
         * Initialize the all function,its load the entire page
         */
        function init() {
            self.availableLimits = commonService.paginationLimit();
            self.menuReport = menuReport;
            self.menuDetails = menuReport;
            menuData = angular.copy(menuReport);
        }
        /**
         * Set the count for a summary list in a page
         * @param amount
         */
        function setValue(amount) {
            commonService.setLimit(amount);
        }
        /**
         * Initially Show count for a summary list in a page
         * @param amount
         */
        function isActiveValue(amount) {
            commonService.isActiveLimit(amount);
        }
        //Reset the Data in the form
        function reset() {
            self.menuReport = menuReport;
            self.month = null;
        }
        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * On selecting the menu,filter the menu item in a summarylist
         * @param menuId
         */
        function filterByMenu(menuId) {
            if (menuId !== undefined) {
                self.menuReport = menuData.filter(function(menu) {
                    return (menu.menuId === menuId);
                });
            } else {
                self.menuData = {};
            }
        }

        /**
         * Based on the monthwise filter the details in monthly menu report
         * @param date
         */
        function filterByMonth(date) {
            var params = {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
            var url = '/api/menuReport';
            return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data
            function successHandler(responseData) {
                self.menuReport = responseData;
            }
        }

        /**
         * Based on the date range filter the details in top sold menu report
         * @param date
         */
        function filterByTopMenu(date) {
            var params = {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
            var url = '/api/topsoldmenu';
            return dataService.getDataFilterBy(url, params).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data
            function successHandler(responseData) {
                self.menuReport = responseData;
            }
        }

        init();
    }
}());