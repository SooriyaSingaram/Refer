/**
 * menu-list-controller
 */
(function() {
    'use strict';
    angular
        .module('menu')
        .controller('menuListController', MenuListController)
    MenuListController.$inject = ['dataService', 'commonService', '$state', 'ksAlertService', 'auth'];
    /**
     * @memberof module:menu
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $state
     * @requires ksAlertService
     * @ngInject 
     */
    function MenuListController(dataService, commonService, $state, ksAlertService, auth) {
        var self = this,
            url = '/api/menus';
        //Pagination
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        //Delete the menu details
        self.deleteMenu = deleteMenu;
        self.getMenus = getMenus;
        self.authorization = authorization;
        //Field Chooser
        self.fChooser_menu = {
            'itemname': true,
            'itemtype': true,
            'itemId': true,
            'createdby': true,
            'sellingprice': true,
            'costprice': true
        };
        //Initialize the all function,its load the entire page
        function init() {
            getMenus();
            self.availableLimits = commonService.paginationLimit();
            authorization();
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
        /**
         * Get the all menus details using data service passing the URL.
         * On success call getting all menus details in a summary list
         */
        function getMenus() {
            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                self.menus = responseData;
            }
        }
        /**
         * Handles the error while getting false function
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Based on the Id and menuId,delete the data from the menu.
         * if menu present in the sales cannot be deleted and displays the warning messages.
         * if menu present in the sales it can be change the status and displays the success message.
         * @param id
         * @param status
         */
        function deleteMenu(id, status) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                dataService.updateData(url, id, {
                    isActive: false
                }).then(successHandler, errorHandler);
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                init();
            }
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