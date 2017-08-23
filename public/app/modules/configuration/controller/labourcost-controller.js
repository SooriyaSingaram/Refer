/**
 * Menu Category Controller
 */
(function() {
    'use strict';
    angular
        .module('configuration')
        .controller('labourcostController', LabourcostController)

    LabourcostController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService','menu'];
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
    function LabourcostController(commonService, dataService, $filter, ksAlertService,menu) {

        var self = this,
            data = {},
            url = '/api/labourcost';

        self.addLabourCost = addLabourCost;
        self.editLabourCost = editLabourCost;
        self.updateLabourCost = updateLabourCost;
        self.deleteLabourCost = deleteLabourCost;
        self.reset = reset;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getLabourCostDetails();
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
        function getLabourCostDetails() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.labourdetails = responseData;
            }
        }
        /**
         * Add the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to add data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function addLabourCost(labourCost) {
            // if (!menuCategoryValidation(labourCost))
            //     return false;
            dataService.saveData(url, labourCost).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getLabourCostDetails();
                labourCost.noofLabour = null;
                labourCost.workingDays = null;
                labourCost.workingHours = null;
                labourCost.totalLabourCost = null;
            }
        }
        /**
         * Update the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to update data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function updateLabourCost(labourCost) {
            // if (!menuCategoryValidation(menuCategory))
            //     return false;
            dataService.updateData(url, labourCost._id, labourCost).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getLabourCostDetails();
            }
        }
        /**
         * By getting all menucategory details in form page while adding or updating,
         * menucategory data validate the existing data and shows warning alert message. 
         * @param menuCategory
         */
        // function menuCategoryValidation(menuCategory) {
        //     for (var i = 0; i < self.menuCategories.length; i++) {
        //         var value = self.menuCategories[i];
        //         if (menuCategory._id === undefined) {
        //             if (value.categoryName.toLowerCase() === menuCategory.categoryName.toLowerCase()) {
        //                 ksAlertService.warn("categoryName already exists");
        //                 return false;
        //             }
        //         } else {
        //             if (value.categoryId !== menuCategory.categoryId && (value.categoryName.toLowerCase() === menuCategory.categoryName.toLowerCase())) {
        //                 ksAlertService.warn("CategoryName already exists");
        //                 return false;
        //             }

        //         }

        //     }
        //     return true;

        // }
        /**
         * Based on the id and labourCostId,update the delete status from the labourCost.
         * If labourCost present in the menu,it cannot be deleted and displays the warning messages.
         * If labourCost not present in the menu,it can be change the status and displays the success message.
         * @param id
         * @param labourCostId
         */
        function deleteLabourCost(id, labourCostId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var labourDetails = menu.filter(function(menu) {
                    return (menu.labourCostId === labourCostId);
                });
                if (labourDetails == 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("Labour cost depends on the menu");
                }

            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getLabourCostDetails();
            }
        }
        /**
         * To set the labourCost details in edit mode
         * @param labourCost
         */
        function editLabourCost(labourCost) {
            console.log(labourCost);
            data = angular.copy(labourCost);
        }
        /**
         * Reset the values in the summary list
         * @param labourCost
         */
        function reset(labourCost) {
            labourCost.noofLabour = data.noofLabour;
            labourCost.workingDays = data.workingDays;
            labourCost.workingHours = data.workingHours;
            labourCost.totalLabourCost = data.totalLabourCost;
        }
        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());