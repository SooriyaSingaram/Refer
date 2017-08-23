/**
 * Category Controller
 */
(function() {
    'use strict';
    angular
        .module('configuration')
        .controller('categoryController', CategoryController)

    CategoryController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', 'subCategory'];
    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires subCategory
     * @ngInject
     */
    function CategoryController(commonService, dataService, $filter, ksAlertService, subCategory) {

        var self = this,
            data = {},
            url = '/api/categories';

        self.addCategory = addCategory;
        self.editCategory = editCategory;
        self.updateCategory = updateCategory;
        self.deleteCategory = deleteCategory;
        self.category = null;
        self.reset = reset;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getCategories();
            self.subCategory = subCategory;
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
         * Get the all categories details using data service passing the URL.
         * On success call getting all category details in a summary list.
         */
        function getCategories() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.categories = responseData;
            }
        }
        /**
         * Add the Category details using data service passing the URL.
         * It's first validate the category details and allow to add data.
         * On success call getting all category details in a summary list.
         */
        function addCategory() {
            if (!categoryValidation(self.category))
                return false;
            dataService.saveData(url, self.category).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getCategories();
                self.category = null;
            }
        }
        /**
         * Update the Category details using data service passing the URL.
         * It's first validate the category details and allow to update data.
         * On success call getting all category details in a summary list.
         * @param category
         */
        function updateCategory(category) {
            if (!categoryValidation(category))
                return false;
            dataService.updateData(url, category._id, category).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getCategories();
            }
        }
        /**
         * By getting all category details in form page while adding or updating,
         * Category data validate the existing data and shows warning alert message. 
         * @param category
         */
        function categoryValidation(category) {
            for (var i = 0; i < self.categories.length; i++) {
                var value = self.categories[i];
                if (category._id === undefined) {
                    if (value.categoryName.toLowerCase() === category.categoryName.toLowerCase()) {
                        ksAlertService.warn("CategoryName already exists");
                        return false;
                    }
                } else {
                    if (value.categoryId !== category.categoryId && (value.categoryName.toLowerCase() === category.categoryName.toLowerCase())) {
                        ksAlertService.warn("CategoryName already exists");
                        return false;
                    }
                }
            }
            return true;
        }
        /**
         * Based on the Id and CategoryId,update the delete status from the category.
         * If category present in the subcategory cannot be deleted and displays the warning messages.
         * If category not present in the subcategory it can be change the status and displays the success message.
         * @param id
         * @param categoryId
         */
        function deleteCategory(id, categoryId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var subCategoryDetails = self.subCategory.filter(function(subCategory) {
                    return (subCategory.categoryId == categoryId);
                });

                if (subCategoryDetails.length === 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("Category already assigned for subCategory so it cannot be deleted");
                }
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted Successfully');
                getCategories();
            }
        }
        /**
         * To set the category details in edit mode
         * @param category
         */
        function editCategory(category) {
            data = angular.copy(category);
        }

        /**
         * Reset the category in the summary list
         * @param category
         */
        function reset(category) {
            category.categoryName = data.categoryName;
        }
        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }

        init();
    }
}());