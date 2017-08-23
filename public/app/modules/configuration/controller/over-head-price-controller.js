/**
 * Menu Category Controller
 */
(function() {
    'use strict';
    angular
        .module('configuration')
        .controller('overheadpriceController', OverheadpriceController)

    OverheadpriceController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService','menu'];
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
    function OverheadpriceController(commonService, dataService, $filter, ksAlertService,menu) {

        var self = this,
            data = {},
            url = '/api/overheadprices';

        self.addOverHeadPrice = addOverHeadPrice;
        self.editOverHeadPrice = editOverHeadPrice;
        self.updateOverHeadPrice = updateOverHeadPrice;
        self.deleteOverHeadPrice = deleteOverHeadPrice;
        self.reset = reset;
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        //Initialize the all function,its load the entire page.
        function init() {
            getOverHeadPriceDetails();
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
        function getOverHeadPriceDetails() {
            dataService.getData(url).then(successHandler); //passing the Get URL to dataService,its sucesss returns the data
            function successHandler(responseData) {
                self.overheadsdetails = responseData;
            }
        }
        /**
         * Add the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to add data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function addOverHeadPrice(overheadprice) {
            // if (!menuCategoryValidation(labourCost))
            //     return false;
            dataService.saveData(url, overheadprice).then(successHandler); //passing the  POST URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getOverHeadPriceDetails();
                overheadprice.noofoverhead = null;
                overheadprice.workingDays = null;
                overheadprice.workingHours = null;
                overheadprice.totaloverheadPrice = null;
            }
        }
        /**
         * Update the menucategory details using data service passing the URL.
         * It's first validate the menucategory details and allow to update data.
         * On success call getting all menucategory details in a summary list.
         * @param menuCategory
         */
        function updateOverHeadPrice(overheadprice) {
            // if (!menuCategoryValidation(menuCategory))
            //     return false;
            dataService.updateData(url, overheadprice._id, overheadprice).then(successHandler); //passing the Update URL to dataService ,its sucesss returns the data
            function successHandler(responseData) {
                getOverHeadPriceDetails();
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
        function deleteOverHeadPrice(id, overHeadPriceId) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                var overheadDetails = menu.filter(function(menu) {
                    return (menu.overHeadPriceId === overHeadPriceId);
                });
                if (overheadDetails == 0) {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler);
                } else {
                    ksAlertService.warn("OverHead price depends on the menu");
                }

            });

            function successHandler(responseData) {
                ksAlertService.warn('Deleted successfully');
                getOverHeadPriceDetails();
            }
        }
        /**
         * To set the labourCost details in edit mode
         * @param labourCost
         */
        function editOverHeadPrice(overheadprice) {
            data = angular.copy(overheadprice);
        }
        /**
         * Reset the values in the summary list
         * @param labourCost
         */
        function reset(overheadprice) {
            overheadprice.noofoverhead = data.noofoverhead;
            overheadprice.workingDays = data.workingDays;
            overheadprice.workingHours = data.workingHours;
            overheadprice.totaloverheadPrice = data.totaloverheadPrice;
        }
        //Handles the error while getting false function
        function errorHandler(e) {
            console.log(e.toString());
        }
        init();
    }
}());