/**
 * Unit Controller
 */
(function() {

    'use strict';

    angular
        .module('configuration')
        .controller('unitController', UnitController)

    UnitController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', 'product', 'menu'];
    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires menu
     * @requires product
     * @ngInject
     */
    function UnitController(commonService, dataService, $filter, ksAlertService, product, menu) {

        var self = this,
            data = {},
            url = '/api/units';

        self.deleteUnit = deleteUnit;
        self.addUnit = addUnit;
        self.updateUnit = updateUnit;
        self.unit = {};
        self.reset = reset;
        self.unitValidation = unitValidation;
        self.editUnit = editUnit;
        self.product = product;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getUnits();
            self.availableLimits = commonService.paginationLimit();

        }
        /**
         * Set the count for a summary list in a page.
         * @param count
         */
        function setValue(count) {
            commonService.setLimit(count);
        }

        /**
         * Initially Show count for a summary list in a page.
         * @param count
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }
        /**
         * Get the all units details using data service passing the URL.
         * On success call getting all unit details in a summary list.
         */
        function getUnits() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.units = responseData;
            }
        }
        /**
         * Add the unit details using data service passing the URL.
         * It's first validate the unit details and allow to add data.
         * On success call getting all unit details in a summary list.
         */
        function addUnit() {
            if (!unitValidation(self.unit))
                return false;
            dataService.saveData(url, self.unit).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getUnits();
                self.unit = null;
            }
        }
        /**
         * Update the unit details using data service passing the URL.
         * It's first validate the unit details and allow to update data.
         * On success call getting all unit details in a summary list.
         * @param unit
         */
        function updateUnit(unit) {
            if (!unitValidation(unit))
                return false;
            dataService.updateData(url, unit._id, unit).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getUnits();
            }
        }
        /**
         * Based on the id and unitId,update the delete status from the unit.
         * If unit present in the product or menu,it cannot be deleted and displays the warning messages.
         * If unit not present in the product or menu,it can be change the status and displays the success message.
         * @param id
         * @param unitId
         */
        function deleteUnit(id, unitId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var productDetails = self.product.filter(function(products) {
                    return (products.unitId === unitId);
                });
                var menuDetails = menu.filter(function(menu) {
                    return (menu.unitId === unitId);
                });
                if (productDetails.length == 0 && menuDetails.length == 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("Unit already assigned for product and Menu so it cannot be deleted");
                }
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getUnits();

            }
        }
        /**
         * By getting all unit details in form page while adding or updating,
         * Unit data validate the existing data and shows warning alert message. 
         * @param unit
         */
        function unitValidation(unit) {
            for (var i = 0; i < self.units.length; i++) {
                var value = self.units[i];
                if (unit._id === undefined) {
                    if (value.unitName.toLowerCase() === unit.unitName.toLowerCase()) {
                        ksAlertService.warn("UnitName already exists");
                        return false;
                    }
                } else {
                    if (value.unitId !== unit.unitId && (value.unitName.toLowerCase() === unit.unitName.toLowerCase())) {
                        ksAlertService.warn("UnitName already exists");
                        return false;
                    }

                }

            }
            return true;

        }
        /**
         * To set the unit details in edit mode
         * @param unit
         */
        function editUnit(unit) {
            data = angular.copy(unit);
        };
        /**
         * Reset the unit in the summary list
         * @param unit
         */
        function reset(unit) {
            unit.unitName = data.unitName;
        }
        /**
         * Handles the error while getting false function
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());