(function() {
    'use strict';
    angular
        .module('inventory')
        .controller('inventoryListController', InventoryListController)
    InventoryListController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', '$state', 'product', 'auth'];

    function InventoryListController(commonService, dataService, $filter, ksAlertService, $state, product, auth) {
        var self = this;
        var url = '/api/inventorysettings';
        self.getAllInventory = getAllInventory;
        self.deleteInventory = deleteInventory;
        self.downloadPdf = downloadPdf;
        self.authorization = authorization;
         self.setValue = setValue;
            self.isActiveValue = isActiveValue;

        /*init()-Initial funtions need to run when onloading file*/
        function init() {
            getAllInventory();
            authorization();
                  self.availableLimits = commonService.paginationLimit();
        }

        /*getAllInventory()-Get all the Inventory Items*/
        function getAllInventory() {
            dataService.getData(url).then(successHandler);

            function successHandler(responseData) {
                self.inventories = responseData;

            }
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

        /*deleteInventory()-Delete Particular Inventory
		@params id
		*/
        function deleteInventory(id) {
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                dataService.updateData(url, id, {
                    isActive: false
                }).then(successHandler, errorHandler);

                function successHandler(responseData) {
                    ksAlertService.warn('Deleted successfully');
                    init();
                }

                function errorHandler(responseData) {
                    init();
                }
            });
        }

        function downloadPdf() {
            var doc = new jsPDF('p', 'pt');
            var elem = document.getElementById("inventorygrid");
            var res = doc.autoTableHtmlToJson(elem);
            doc.text('Title', 7, 7);
            //    doc.autoTable(res.columns, res.data,{margins: {horizontal: 40, top: 60, bottom: 40}});
            doc.autoTable(res.columns, res.data);
            doc.save("table.pdf");
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