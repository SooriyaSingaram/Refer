/**
 * Purchase Order List Controller
 * @Purchase Order Module
 */
(function() {

    'use strict';

    angular
        .module('purchase-order')
        .controller('purchaseOrderListController', PurchaseOrderListController)


    PurchaseOrderListController.$inject = ['dataService', 'commonService', '$state', 'ksAlertService', 'auth', 'roles', 'franchise', 'outlet', 'invoices'];
    /**
     *controller for Listing all the Purchase Orders.
     *
     * @memberOf module:purchase-order
     *
     * @requires dataService
     * @requires commonService
     * @requires $state
     * @requires ksAlertService
     */
    function PurchaseOrderListController(dataService, commonService, $state, ksAlertService, auth, roles, franchise, outlet, invoices) {

        var self = this,
            url = '/api/purchaseorders'
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;
        self.deletePurchaseOrder = deletePurchaseOrder;
        self.showHideField = showHideField;
        self.setTab = setTab;
        self.isSet = isSet;
        self.authorization = authorization;
        self.updatepurchaseOrder = updatepurchaseOrder;
        self.cancelPO = cancelPO;
        self.disableIcon = disableIcon;
        //Set the Tab for Active Franchise  Branch Details
        function setTab(tabId) {
            this.tab = tabId;
        };
        //Set the Tab for InActive Franchise  Branch Details
        function isSet(tabId) {
            return this.tab === tabId;
        }
        /**
         * Field Chooser for grid
         * grid shows initially  following fields   
         */
        self.fChooser_purchaseOrder = {
            'branch': true,
            'date': true,
            'PO_created_by': true,
            'PO_status': true
        };
        /**
         * Initialize the functions while loading controller
         * Listing all the Purchase Order
         */
        function init() {
            showHideField();
            getPurchaseOrders();
            getUserRole();
            self.availableLimits = commonService.paginationLimit();
            authorization();
            self.invoices = invoices;
        }
        /**
         * getUserRole function is used get who logged in application for role base details get method
         */
        function getUserRole() {

            self.loginUser = roles.filter(function(role) {
                return (role.roleId == auth.role);
            });
            self.outlet = outlet.filter(function(outlet) {
                return (outlet.branchId == auth.branchId);
            });
            self.franchiseOutlet = outlet.filter(function(outlet) {
                return (outlet.outletType.outletType == 'Franchise');
            });

            dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(response) {

                filterBranch(response);
                if (['KS_RS001', 'KS_RS004', 'KS_RS005','KS_RS002'].indexOf(self.loginUser[0].roleId) > -1) {
                    self.purchaseOrders = getInvoiceStatus(response);
                } else if (auth.role == "KS_RS006") {
                   franchisePurchase(response);
                   self.purchaseOrders = getInvoiceStatus(response);
                } else {
                    self.purchaseOrders = getInvoiceStatus(response);
                    self.poOrders = response;
                    self.purchaseOrders = self.poOrders.filter(function(po) {
                        return (po.branchId == auth.branchId);
                    });
                }
            }
        }
        /**
         * franchisePurchase function is used get Franchise purchase order details
         * @params response
         */
        function franchisePurchase(response) {
                self.franchiseOrder = [];
                _.forEach(franchise, function(po) {
                    var product = _.find(response, {
                        branchId: po.branchId
                    });
                    if (product !== undefined) {
                        self.franchiseOrder.push(product);
                    }
                })
                _.forEach(self.franchiseOutlet, function(po) {
                    var productname = _.find(response, {
                        branchId: po.branchId
                    })
                    if (productname !== undefined) {
                        self.franchiseOrder.push(productname);
                    }
                })
                self.purchaseOrders = self.franchiseOrder;
                self.supplierPO = self.franchiseOrder;
        }
         /**
         * filterBranch function is used get filter the outlet and franchises and get details
         * @params response
         */
        function filterBranch(response) {

            angular.forEach(response, function(purchaseOrder, key) {

                var outletss = outlet.filter(function(branch) {
                    return (purchaseOrder.branchId == branch.branchId);
                });
                var franchiseBranch = franchise.filter(function(branch) {
                    return (purchaseOrder.branchId == branch.branchId);
                });
                if (outletss[0]) {
                    purchaseOrder.branchName = outletss[0].branchName;
                } else if (franchiseBranch[0]) {
                    purchaseOrder.branchName = franchiseBranch[0].branchName;
                }
            })
        }
        /**
         * Set limit for showing Purchase Order list
         * @param {String} limit - selected count of entries to be shown in Daily Occurrences list
         */
        function setValue(amount) {
            commonService.setLimit(amount);
        }
        /**
         * Initial limit for showing Purchase Order list
         * @param {String} limit - Initialy set limit of Purchase Order shown in the list 
         */
        function isActiveValue(amount) {
            commonService.isActiveLimit(amount);
        }

        /**
         * Get All the Requests using data service by passing Url
         */
        function getPurchaseOrders() {
            self.role = auth.role;
            return dataService.getData(url).then(successHandler, errorHandler);

            function successHandler(responseData) {
                filterBranch(responseData);

                if ((auth.role == "KS_RS001") || (auth.role == "KS_RS004") ||  (auth.role == "KS_RS002")) {
                    
                    self.supplierPO = getInvoiceStatus(responseData);
                }
                else if (auth.role == "KS_RS006") {
                    franchisePurchase();
                    self.supplierPO = getInvoiceStatus(responseData);
                }
                 else {
                    self.supplierPO = getInvoiceStatus(responseData);
                    self.poOrders = responseData;
                    self.supplierPO = self.poOrders.filter(function(po) {
                        return (po.branchId == auth.branchId);
                    });
                }

            }
        }
         /**
         * getInvoiceStatus used hide and disable the botton in purchase-order-list page
         * @param display supplierPO
         */
        function getInvoiceStatus(supplierPO) {
            angular.forEach(supplierPO, function(purchaseOrderData) {
                angular.forEach(invoices, function(invoiceData) {
                    //  if(invoiceData.supplier === true){
                    //     if((purchaseOrderData.supplierId === invoiceData.supplierId) && ((invoiceData.status === 'Paid') || (invoiceData.status === 'Partially Paid'))) {
                    //     purchaseOrderData["displayNone"] = true;
                    //     }
                    // }
                    if ((purchaseOrderData._id === invoiceData.purchaseOrderId) && ((invoiceData.status === 'Paid') || (invoiceData.status === 'Partially Paid'))) {
                        purchaseOrderData["displayNone"] = true;
                    }
                })
            })
            return supplierPO;
        }
        /**
         * Displaying invoice Icon once status message rise it showa alert.
         * @param display
         */
        function disableIcon(display){
            if(display){
                ksAlertService.warn('Invoice has been generated for this purchase order, If any info please go to invoice list page.');
            }
        }
        /**
         * Delete Particular Purchase Order
         * @param {String} id,purchaseOrderId - Particular purchase Order status updated to inactive based on id.
         */
        function deletePurchaseOrder(id, purchaseOrderId) {
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
         * Update the purchaseOrder details using data service passing the URL.
         * Its first validate the purchaseOrder details and allow to update data.
         * On success call getting all purchaseOrder details in a summary list.
         * @param purchaseOrder
         */
        function updatepurchaseOrder(purchaseOrder) {
             ksAlertService.confirm("Are you sure you want to approve this purchase order?").then(function() {
                purchaseOrder.status = "Ordered";
                dataService.updateData(url, purchaseOrder._id, purchaseOrder).then(successHandler, errorHandler)

            });
            function successHandler(responseData) {
                ksAlertService.warn('Successfully done');
                init();
            }
            
        }
        /**
         * Update the purchaseOrder details using data service passing the URL.
         * Its first validate the purchaseOrder details and allow to update data.
         * On success call getting all purchaseOrder details in a summary list.
         * @param purchaseOrder
         */
        function cancelPO(purchaseOrder) {
            ksAlertService.confirm("Are you sure you want to cancel this purchase order?").then(function() {
                purchaseOrder.status = "Cancelled";
                dataService.updateData(url, purchaseOrder._id, purchaseOrder).then(successHandler, errorHandler)

            });
        }
        /**
         * hide button based on role
         * @param {String} e - displaying error notification while running request list controller
         */
        function showHideField() {
            self.outletFilter = outlet.filter(function(outlet) {
                return (outlet.branchId == auth.branchId);
            });
            if (auth.role == "KS_RS001") {
                self.showAll = true;
                self.menuTab = true;
                self.productTab = true;
                self.supplierTab = true;
                self.tab = 1;
                self.addProductPo = true;
                self.addBranchPO = true;
                self.ckproductTab = true;

            } else if (auth.role == "KS_RS005") {
                self.showUpdatePO = true;
                self.menuTab = true;
                self.ckproductTab = true;
                self.branchProductView = true;
                self.addProductPo = true;
                self.tab = 1;

            } else if (auth.role == "KS_RS004") {
                self.showUpdatePO = true;
                self.addProductPo = true;
                self.ckproductTab = true;
                self.supplierTab = true;
                self.productTab = true;
                self.updateProductPO = true;
                self.tab = 2;
            } else if (auth.role == "KS_RS002") {
                 self.showAll = true;
                self.menuTab = true;
                self.productTab = true;
                self.tab = 1;
                self.ckproductTab = true;
                self.adminview = true;
                self.tab = 5;

            } else {

                self.addBranchPO = true;
                self.branchProductView = true;
                self.branchView = true;
                self.menuTab = true;
                self.productTab = true;
                self.tab = 1;
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
         * authorization
         * role base view action of logged in employee view
         */
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