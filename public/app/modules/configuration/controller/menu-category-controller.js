/**
 * Menu Category Controller
 */
(function() {
    'use strict';
    angular
        .module('configuration')
        .controller('menuCategoryController', MenucategoryController)

    MenucategoryController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', 'menu'];
    /**
     * @memberof module:configuration
     * 
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires menu
     * @ngInject
     */
    function MenucategoryController(commonService, dataService, $filter, ksAlertService, menu) {

        var self = this,
            data = {},
            url = '/api/menucategories';

        self.addMenuCategory = addMenuCategory;
        self.editMenuCategory = editMenuCategory;
        self.updateMenuCategory = updateMenuCategory;
        self.deleteMenuCategory = deleteMenuCategory;
        self.reset = reset;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getMenuCategories();
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
         * Get the all menucategories details using data service passing the URL.
         * On success call getting all menucategories details in a summary list.
         */
        function getMenuCategories() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.menuCategories = responseData;
            }
        }
        /**
         * Add the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to add data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function addMenuCategory(menuCategory) {
            if (!menuCategoryValidation(menuCategory))
                return false;
            dataService.saveData(url, menuCategory).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getMenuCategories();
                menuCategory.categoryName = null;
            }
        }
        /**
         * Update the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to update data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function updateMenuCategory(menuCategory) {
            if (!menuCategoryValidation(menuCategory))
                return false;
            dataService.updateData(url, menuCategory._id, menuCategory).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getMenuCategories();
            }
        }
        /**
         * By getting all menucategory details in form page while adding or updating,
         * menucategory data validate the existing data and shows warning alert message. 
         * @param menuCategory
         */
        function menuCategoryValidation(menuCategory) {
            for (var i = 0; i < self.menuCategories.length; i++) {
                var value = self.menuCategories[i];
                if (menuCategory._id === undefined) {
                    if (value.categoryName.toLowerCase() === menuCategory.categoryName.toLowerCase()) {
                        ksAlertService.warn("categoryName already exists");
                        return false;
                    }
                } else {
                    if (value.categoryId !== menuCategory.categoryId && (value.categoryName.toLowerCase() === menuCategory.categoryName.toLowerCase())) {
                        ksAlertService.warn("CategoryName already exists");
                        return false;
                    }

                }

            }
            return true;

        }
        /**
         * Based on the id and menuCategoryId,update the delete status from the menucategory.
         * If menucategory present in the menu,it cannot be deleted and displays the warning messages.
         * If menucategory not present in the menu,it can be change the status and displays the success message.
         * @param id
         * @param menuCategoryId
         */
        function deleteMenuCategory(id, menuCategoryId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var menuDetails = menu.filter(function(menu) {
                    return (menu.menucategoryId === menuCategoryId);
                });
                if (menuDetails == 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("Menu category depends on the menu");
                }

            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getMenuCategories();
            }
        }
        /**
         * To set the menucategory details in edit mode
         * @param menucategory
         */
        function editMenuCategory(menuCategory) {
            data = angular.copy(menuCategory);
        }
        /**
         * Reset the values in the summary list
         * @param menucategory
         */
        function reset(menuCategory) {
            menuCategory.categoryName = data.categoryName;
        }
        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());