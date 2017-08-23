/**
 * SubCategory Controller
 */
(function() {

    'use strict';

    angular
        .module('configuration')
        .controller('subCategoryController', SubCategoryController)

    SubCategoryController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', 'product', 'category'];
    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires product
     * @requires category
     * @ngInject
     */

    function SubCategoryController(commonService, dataService, $filter, ksAlertService, product, category) {

        var self = this,
            data = {},
            url = '/api/subcategories';

        self.deleteSubCategory = deleteSubCategory;
        self.addSubCategory = addSubCategory;
        self.updateSubCategory = updateSubCategory;
        self.subcategory = null;
        self.reset = reset;
        self.editSubCategory = editSubCategory;
        self.product = product;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getSubCategories();
            self.categories = category;
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
         * Get the all subcategories details using data service passing the URL.
         * On success call getting all subcategory details in a summary list.
         */
        function getSubCategories() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.subCategories = responseData;
            }
        }
        /**
         * Add the subategory details using data service passing the URL.
         * It's first validate the subcategory details and allow to add data.
         * On success call getting all subcategory details in a summary list.
         * @param subCategory
         */
        function addSubCategory(subCategory) {
            if (!subCategoryValidation(subCategory))
                return false;
            dataService.saveData(url, subCategory).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getSubCategories();
                self.subCategory = null;
            }
        }
        /**
         * Update the subcategory details using data service passing the URL.
         * It's first validate the subcategory details and allow to update data.
         * On success call getting all subcategory details in a summary list.
         * @param subCategory
         */
        function updateSubCategory(subCategory) {
            if (!subCategoryValidation(subCategory))
                return false;
            dataService.updateData(url, subCategory._id, subCategory).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getSubCategories();
            }
        }
        /**
         * Based on the id and subcategoryId,update the delete status from the subcategory.
         * If subcategory present in the  product,it cannot be deleted and displays the warning messages.
         * If subcategory not present in the product ,it can be change the status and displays the success message.
         * @param id
         * @param subCategoryId
         */
        function deleteSubCategory(id, subCategoryId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var productDetails = self.product.filter(function(products) {
                    return (products.subCategoryId === subCategoryId);
                });
                if (productDetails.length === 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("SubCategory already assigned for product so it cannot be deleted");
                }
            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getSubCategories();
            }
        }
        /**
         * By getting all subcategory details in form page while adding or updating,
         * subcategory data validate the existing data and shows warning alert message. 
         * @param subCategory
         */
        function subCategoryValidation(subCategory) {
            for (var i = 0; i < self.subCategories.length; i++) {
                var value = self.subCategories[i];
                if (subCategory._id === undefined) {
                    if (value.subCategoryName.toLowerCase() === subCategory.subCategoryName.toLowerCase() && (value.categoryId === subCategory.categoryId)) {
                        subCategory.subCategoryName = null;
                        ksAlertService.warn("SubcategoryName and categoryName already exists");
                        return false;
                    }
                } else {
                    if (value.subCategoryId !== subCategory.subCategoryId && (value.subCategoryName.toLowerCase() === subCategory.subCategoryName.toLowerCase() && (value.categoryId === subCategory.categoryId))) {
                        ksAlertService.warn("SubcategoryName and categoryName already exists");
                        return false;
                    }

                }

            }
            return true;

        }
        /**
         * To set the subcategory details in edit mode
         * @param subCategory
         */
        function editSubCategory(subCategory) {
            data = angular.copy(subCategory);
        };
        /**
         * Reset the values in the summary list
         * @param subcategory
         */
        function reset(subCategory) {
            subCategory.subCategoryName = data.subCategoryName;
        }

        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());