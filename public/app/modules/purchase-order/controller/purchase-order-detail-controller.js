/**
 * Purchase Order Detail Controller
 * @Purchase Order Module
 */
(function() {

    'use strict';

    angular
        .module('purchase-order')
        .controller('purchaseOrderDetailController', PurchaseOrderDetailController)

    PurchaseOrderDetailController.$inject = ['commonService', 'dataService', '$state', 'menus', 'products', 'franchise', 'ksAlertService', '$filter', 'auth', 'outlet', 'supplierdetails', 'roles', '$scope', 'inventorylevel', 'units'];
    /**
     * controller for Purchase Order 
     * @memberOf module:purchase-order
     * @requires commonService
     * @requires dataService
     * @requires $state
     * @requires auth
     * @requires outlet
     * @requires products
     */

    function PurchaseOrderDetailController(commonService, dataService, $state, menus, products, franchise, ksAlertService, $filter, auth, outlet, supplierdetails, roles, $scope, inventorylevel, units) {

        var self = this,
            url = '/api/purchaseorders',
            loginDetail,
            data;
        self.purchaseOrder = {};
        self.disableSubmit = disableSubmit;
        self.getPurchaseOrderDetails = getPurchaseOrderDetails;
        self.addPurchaseOrder = addPurchaseOrder;
        self.updatePurchaseOrder = updatePurchaseOrder;
        self.addMenuDetail = addMenuDetail;
        self.removeMenuDetail = removeMenuDetail;
        self.addProductDetail = addProductDetail;
        self.reset = reset;
        self.formValidation = commonService.formValidation;
        self.validateProductDetail = validateProductDetail;
        self.validateMenuItem = validateMenuItem;
        self.checkOrderedProductQty = checkOrderedProductQty;
        self.checkItemDetails = checkItemDetails;
        self.getMenuDetail = getMenuDetail;
        self.getProductDetail = getProductDetail;
        self.endDateBeforeRender = endDateBeforeRender;
        self.endDateOnSetTime = endDateOnSetTime;
        self.showHideField = showHideField;
        self.supplierBasedPO = supplierBasedPO;
        self.checkWarehouse = checkWarehouse;
        self.checkQty = checkQty;
        self.checkReceivedQty = checkReceivedQty;
        self.cancelPO = cancelPO;
        self.warehouseproduct = [];
        /**
         * Cancel the requested purchase order
         * @param purchaseOrder 
         */
        function cancelPO(purchaseOrder) {
            ksAlertService.confirm("Are You Sure You Want To Cancel This PO?").then(function() {
                purchaseOrder.status = "Cancelled";
                dataService.updateData(url, purchaseOrder._id, purchaseOrder).then(successHandler, errorHandler)

            });
        }
        /**
         * check total amout of Received Qty of Product / Menu
         * @param item,ordered,supplied, received 
         */
        function checkReceivedQty(item, ordered, supplied, received) {
            if (item.receivedDetails.length >= 1) {
                var total = [];
                for (var i = 0; i < item.receivedDetails.length; i++) {
                    total.push(item.receivedDetails[i].receivedQty);
                }
                var totalReceived = total.reduce(function(a, b) {
                    return a + b;
                }, 0);
                var receivedItemQty = totalReceived + received;
                if (supplied < received && received > 0) {
                    ksAlertService.warn("Received qty must be less than supplied qty");
                    item.receivedQty = '';
                } else if (ordered < receivedItemQty) {
                    ksAlertService.warn("Already received" + "" + totalReceived + " " + "item");
                } else if (ordered == receivedItemQty) {
                    item.status = "Received";
                } else if (ordered > receivedItemQty) {
                    item.status = "Partially Received";
                }
                if (ordered == totalReceived) {
                    item.status = "Received";
                    item.receivedQty = 0;
                }
            } else {
                if (supplied < received && received > 0) {
                    ksAlertService.warn("Received qty must be less than supplied qty");
                    item.receivedQty = '';
                } else if ((ordered) == received) {
                    item.status = "Received";
                } else if ((ordered) > received && received > 0) {
                    item.status = "Partially Received";
                }
            }
        }
        /**
         * check total amout of Supplied Qty of Product / Menu
         * @param item,ordered,supplied, received 
         */
        function checkQty(item, ordered, supplied) {
            if (item.suppliedDetails.length >= 1) {
                var total = [];

                for (var i = 0; i < item.suppliedDetails.length; i++) {
                    total.push(item.suppliedDetails[i].suppliedQty);
                }
                var totalSupplied = total.reduce(function(a, b) {
                    return a + b;
                }, 0);
                var suppliedItemQty = totalSupplied + supplied;
                if (ordered < suppliedItemQty) {
                    ksAlertService.warn("Already supplied" + "" + totalSupplied + " " + "item");
                    item.suppliedQty = 0;
                }
                if (ordered == suppliedItemQty) {
                    item.status = "Supplied";
                }
                if (ordered == totalSupplied) {
                    item.status = "Supplied";
                    item.suppliedQty = 0;
                }
                if(ordered>suppliedItemQty){
                     item.status = "Partially Supplied";
                }
            } else {
                if (ordered < supplied) {
                    ksAlertService.warn("Supplied qty must be less than ordered qty");
                    item.suppliedQty = '';
                }
                if (ordered == supplied) {
                    item.status = "Supplied";
                }
                if (ordered > supplied && supplied > 0) {
                    item.status = "Partially Supplied";
                }
            }

        }
        //Check login branch is a warehouse or not for show supplier field 
        function checkWarehouse(branch) {
            self.wareHouse = outlet.filter(function(outlet) {
                return (outlet.branchId == branch);
            })
            if (self.wareHouse[0].outletType.outletType == "Ware House" && auth.role == "KS_RS001") {
                self.supplierField = false;
                self.wareHouseField = true;
            } else {
                self.supplierField = true;
                self.wareHouseField = false;
            }
        }

        // Initialize the functions while loading controller
        function init() {
            self.outletBranch = outlet.filter(function(outlet) {
                return (outlet.outletType.outletType == 'Ware House' || outlet.outletType.outletType == 'Centralized Kitchen');
            })
            self.branchList = outlet.filter(function(outlet) {
                return (outlet.outletType.outletType == 'Outlet' || outlet.outletType.outletType == 'Franchise');
            })
            self.outlet = self.branchList.concat(franchise);
            self.franchiseOutlet = outlet.filter(function(outlet) {
                return (outlet.outletType.outletType == "Franchise");
            });
            self.franchiseBranch = self.franchiseOutlet.concat(franchise);
            self.outletDetail = outlet;
            getUserRole();
            self.supplierdetails = supplierdetails;
            self.menus = menus;
            getPurchaseOrderDetails();
            self.products = products;
            angular.forEach(products, function(product) { 
                angular.forEach(inventorylevel, function(inventory) { 
                       angular.forEach(inventory.listOfProducts, function(inventoryproduct) { 
                            if(product.productId == inventoryproduct.productId){
                                selectedproduct(product);
                            }
                         })
                     })
             })
             function selectedproduct(product){
                    self.warehouseproduct.push(product);
             }
            
                 
            showHideField();
        }
        /**
         * Get User Role based on login
         * @param role 
         */
        function getUserRole() {
            self.loginUser = roles.filter(function(role) {
                return (role.roleId == auth.role);
            });
            self.loginDetail = self.loginUser[0].roleId;
            var branchdetails = auth.branchId;
            self.branchType = outlet.filter(function(outlets) {
                return (outlets.branchId == branchdetails);
            });
            self.role = roles;
        }
        /**
         * Show hide fields based on login
         * @param loginDetail
         */
        function showHideField() {
            self.outletFilter = outlet.filter(function(outlet) {
                return (outlet.branchId == auth.branchId);
            });

            if (auth.role == "KS_RS001") {
                self.adminView = true;
                self.supplyCK = false;
                self.receivedck = false;
                self.hideReceivedField = false;
                self.hideSuppliedField = false;
            } else if (self.loginDetail == "KS_RS006") {
                self.adminView = true;
            } else if (self.loginDetail == "KS_RS005") {
                self.hideReceivedField = true;
                self.receivedck = false;
                self.supplyCK = true;
                self.hideSuppliedField = false;
            } else if (self.loginDetail == "KS_RS004") {
                self.hideReceivedField = true;
                self.receivedck = true;
                self.supplyCK = false;
                self.hideSuppliedField = false;
            } else {
                self.hideReceivedField = false;
                self.hideSuppliedField = true;
            }
        }
        /**
         * Checking maximum and minimum quantity for product details.
         * @param min
         * @param max
         * @param product
         */
        function checkOrderedProductQty(product, productId, order, newOrder) {
            var selectedProduct = products.filter(function(product) {
                return (product.productId == productId);
            });

            var totalOrder = order + newOrder;
            if (selectedProduct[0].maxQtyPO < totalOrder) {
                ksAlertService.warn("Total ordered qty should be less then maximum purchase order qty of product");
                product.newOrderQty = '';
            }
        }
        /**
         * Reset all form fields to their default values 
         * @param {String} employee Employee values to form field
         */
        function reset() {
            setData(data);
        }
        /**
         * Copy form data if values are available 
         * @param {String} purchaseorder Purchase order values set to form field
         */
        function setData(purchaseOrder) {
            data = purchaseOrder;
            self.purchaseOrder = angular.copy(data);
        }
        /**
         * Get the purchase order details based on Id using data by service passing the URL.
         */
        function getPurchaseOrderDetails() {
            self.isEditmode = commonService.isEditMode();

            if (self.isEditmode) {
                commonService.getDataById(url).then(function(purchaseOrder) {
                    data = angular.copy(purchaseOrder);
                    self.purchaseOrder = purchaseOrder;
                    setData(self.purchaseOrder);
                });
            } else {
                if (self.loginUser[0].roleName != self.role[0].roleName) {
                    self.purchaseOrder.branchId = auth.branchId;
                    setData(self.purchaseOrder);
                } else {
                    setData(self.purchaseOrder);
                }

            }
        }
        //Check the Menu ingredient based on create the menu details array
        function checkItemDetails() {
            if (self.purchaseOrder && !self.purchaseOrder.menuDetail && self.purchaseOrder.menuItem == true) {
                self.purchaseOrder.menuDetail = [];
                self.addMenuDetail(self.purchaseOrder.menuDetail);
            } else if ((self.purchaseOrder && !self.purchaseOrder.productDetail && self.purchaseOrder.menuItem == false) || (self.purchaseOrder && !self.purchaseOrder.productDetail && self.purchaseOrder.requestProductTo !== '')) {
                self.purchaseOrder.productDetail = [];
                self.addProductDetail(self.purchaseOrder.productDetail);
            }
        }
        /**
         * Add the Menu Detail values into the menuDetail array.
         * @params menuDetail
         */
        function addMenuDetail(menuDetail) {
            menuDetail.push({
                itemId: '',
                itemName: '',
                qty: '',
                unitId: '',
                unitPrice: '',
                receivedQty: '',
                suppliedQty: '',
                deliveryDate: null,
                description: '',
                status: 'Ordered',
                suppliedDetails: [],
                receivedDetails: []
            });
        }
        /**
         * removing selected Menu Detail when removeMenuDetail function triggered
         * @params menuDetail
         * @params index
         */
        function removeMenuDetail(menuDetail, index) {
            (menuDetail.length === 1) ? ksAlertService.warn('Please select at least one item'): menuDetail.splice(index, 1);
        }
        /**
         * By getting all selected Menu details in form page while adding or updating,
         * selected Menu data validate the existing data and shows warning alert message. 
         * @params selectedMenu
         */
        function getMenuDetail(selectedMenu, menu) {
            self.menuItemDetail = self.menus.filter(function(menu) {
                return (menu.menuId == selectedMenu);
            });
            menu.unitId = self.menuItemDetail[0].unitId;
            menu.unitPrice = self.menuItemDetail[0].outletPrice;
            if (menu.unitPrice == NaN) {
                menu.unitPrice = 0;
            }
        }
        /**
         * By getting all selected Product details in form page while adding or updating,
         * selected Product data validate the existing data and shows warning alert message. 
         * @params-selectedProduct, product, branchName
         */
        function getProductDetail(selectedProduct, product, branchName) {
            self.productDetails = self.products.filter(function(product) {
                return (product.productId == selectedProduct);
            });
            product.unitPrice = self.productDetails[0].outletPrice;
            product.productName = self.productDetails[0].productName;
            product.unitId = self.productDetails[0].unitId;
            self.unit = units.filter(function(unitdetails) {
                return (unitdetails.unitId == product.unitId);
            });
            product.unitName = self.unit[0].unitName;
            if (product.unitPrice == NaN) {
                product.unitPrice = 0;
            }
            product.suppliernames = self.productDetails[0].supplierDetails;
            var suppliers = $filter('filter')(self.productDetails[0].supplierDetails, {
                defaultsupplier: "yes"
            });
            product.supplierId = suppliers[0].id;
            dataService.getData(url).then(success, errorHandler);

            function success(response) {
                var POBranch = _.filter(response, {
                    branchId: branchName
                })
                if (POBranch.length == 0) {
                    product.orderedQty = 0;
                } else {
                    var totalQty = 0;
                    var receivedtotal = 0;
                    angular.forEach(POBranch, function(pos) {
                        if (pos.productDetail.length > 0) {
                            angular.forEach(pos.productDetail, function(pro) {
                                if (selectedProduct == pro.productId) {
                                    if (pro.status == 'Received') {
                                        totalQty = 0
                                    } else if (pro.status == 'Partially Received') {
                                        angular.forEach(pro.receivedDetails, function(rec) {
                                            receivedtotal += rec.receivedQty;
                                        })
                                        totalQty += (pro.orderedQty + pro.newOrderQty - receivedtotal)
                                    } else {
                                        totalQty += (pro.orderedQty + pro.newOrderQty)
                                    }
                                }
                            })
                            product.orderedQty = totalQty;
                        } else if (pos.menuDetail.length > 0) {
                            product.orderedQty = 0;
                        }
                    });
                }
            }
        }
        /**
         * By getting all selected Menu details in form page while adding or updating,
         * selected Menu data validate the existing data and shows warning alert message. 
         * @params selectedMenu
         */
        function validateMenuItem(menu, selectedMenu) {
            var count = 0;
            angular.forEach(self.purchaseOrder.menuDetail, function(menu) {
                if (menu.itemId === selectedMenu.itemId) {
                    count++;
                }
            });
            if (count >= 2) {
                ksAlertService.warn('Menu item already exists');
                selectedMenu.itemId = "";
            }
        }
        /**
         * Add the Menu Detail ng-model values into the menuDetail array.
         * @params menuDetail
         */
        function addProductDetail(productDetail) {
            productDetail.push({
                productId: '',
                productName: '',
                orderedQty: '',
                receivedQty: '',
                suppliedQty: '',
                newOrderQty: '',
                supplierId: '',
                unitId: '',
                unitName: '',
                unitPrice: '',
                status: 'Ordered',
                suppliedDetails: [],
                receivedDetails: []
            });
        }

        /**
         * By getting all selected Menu details in form page while adding or updating,
         * selected Menu data validate the existing data and shows warning alert message. 
         * @param selectedMenu
         */
        function validateProductDetail(product, selectedProduct) {
            var count = 0;
            angular.forEach(self.purchaseOrder.productDetail, function(product) {
                if (product.productId === selectedProduct.productId) {
                    count++;
                }
            });
            if (count >= 2) {
                ksAlertService.warn('Product already exists');
                selectedProduct.productId = "";
            }
        }
        //enable form field on click the edit button
        function disableSubmit() {
            self.submitbut = false;
        }
        /**
         * supplierDetailsTracking used to track who supply the PO products to branch
         * @params purchaseOrder
         */
        function supplierDetailsTracking(purchaseOrder) {
            (purchaseOrder.menuDetail.length < 1) ? self.suppliedItem = purchaseOrder.productDetail: self.suppliedItem = purchaseOrder.menuDetail;
            for (var j = 0; j < self.suppliedItem.length; ++j) {
                var suppliedDetails = self.suppliedItem[j].suppliedDetails;
                var obj = {}
                obj.suppliedDate = new Date();
                obj.suppliedId = auth.employeeId;
                obj.suppliedQty = self.suppliedItem[j].suppliedQty;
                suppliedDetails.push(obj);
            }
        }
        /**
         * receivedDetailsTracking used to track who received the PO products by branch
         * @params purchaseOrder
         */
        function receivedDetailsTracking(purchaseOrder) {
            (purchaseOrder.menuDetail.length < 1) ? self.receivedItem = purchaseOrder.productDetail: self.receivedItem = purchaseOrder.menuDetail;


            for (var j = 0; j < self.receivedItem.length; ++j) {
                var receivedDetails = self.receivedItem[j].receivedDetails;
                var obj = {}
                obj.receivedDate = new Date();
                obj.receivedId = auth.employeeId;
                obj.receivedQty = self.receivedItem[j].receivedQty;
                receivedDetails.push(obj);
            }
        }
        /**
         * statusFunctionality functionality which is used in CK and WH approving 
           the PO products for we have use this function
         * @params purchaseOrder
         */
        function statusFunctionality(purchaseOrder) {
            if (purchaseOrder.menuDetail.length < 1) {
                var statusUpdate = purchaseOrder.productDetail;
            }
            if (purchaseOrder.menuDetail.length >= 1) {
                var statusUpdate = purchaseOrder.menuDetail;
            }
            var partiallySupplied = _.where(statusUpdate, {
                status: "Partially Supplied"
            });
            var supplied = _.where(statusUpdate, {
                status: "Supplied"
            });
            var partiallyReceived = _.where(statusUpdate, {
                status: "Partially Received"
            });
            var received = _.where(statusUpdate, {
                status: "Received"
            });
            if (partiallyReceived.length > 0) {
                purchaseOrder.status = "Partially Received";
            }
            if (partiallyReceived.length == 0 && received.length > 0) {
                purchaseOrder.status = "Received";
            }
            if (partiallySupplied.length > 0) {
                purchaseOrder.status = "Partially Supplied";
            }

            if (partiallySupplied.length == 0 && supplied.length > 0) {
                purchaseOrder.status = "Supplied";
            }
        }
        /**
         * Update particular Purchase Order detail using data service passing the URL.
         * @param {String}purchaseOrder -to update Purchase Order detail
         */
        function updatePurchaseOrder(purchaseOrder) {
                 purchaseOrder.wareHouseId = "KS_IN001";
                 statusFunctionality(purchaseOrder);
                    if (purchaseOrder.productDetail.length > 0) {
                            if (auth.role == "KS_RS004") {
                                    if (purchaseOrder.requestProductTo === 'Supplier') {
                                            receivedDetailsTracking(purchaseOrder);
                                    } else {
                                            supplierDetailsTracking(purchaseOrder);
                                    }
                            } else {
                                    receivedDetailsTracking(purchaseOrder);
                            }
                    } else if (purchaseOrder.menuDetail.length > 0) {
                            if (auth.role == "KS_RS005") {
                                    supplierDetailsTracking(purchaseOrder);
                            } else {
                                    receivedDetailsTracking(purchaseOrder);
                            }
                    }
                dataService.updateData(url, purchaseOrder._id, purchaseOrder).then(successHandler, errorHandler);
        }
        /**
         * Create Purchase Order  using data service passing the URL.
         * @param {String} purchaseorder Purchase Order detail to add
         */
        function addPurchaseOrder(purchaseOrder) {
            if (purchaseOrder.menuDetail == undefined || purchaseOrder.menuDetail.length == 0) {
                var copyPODetail = purchaseOrder.productDetail;
            }
            if (purchaseOrder.productDetail == undefined || purchaseOrder.productDetail.length == 0) {
                var copyPODetail = purchaseOrder.menuDetail;
            }

            for (var j = 0; j < copyPODetail.length; ++j) {
                copyPODetail[j].receivedQty = null;
                copyPODetail[j].suppliedQty = null;
                copyPODetail[j].status = 'Ordered';
                while (copyPODetail[j].receivedDetails.length > 0) {
                    copyPODetail[j].receivedDetails.pop();
                }
                while (copyPODetail[j].suppliedDetails.length > 0) {
                    copyPODetail[j].suppliedDetails.pop();
                }
            }
            if(purchaseOrder.requestProductTo == "Supplier"){
                    purchaseOrder.status = "Requested";
               }else{
                    purchaseOrder.status = "Ordered";
             }
            purchaseOrder._id = null;
            purchaseOrder.createdBy = auth.employeeId;
            dataService.saveData(url, purchaseOrder).then(successHandler, errorHandler);
        }
        /**
         * Create Purchase Order for supplier using data service passing the URL.
         * @param {String} purchaseorder Purchase Order detail to add
         */
        function supplierBasedPO(purchaseOrder) {
            var productDetails = createPO(purchaseOrder.productDetail);
            angular.forEach(productDetails, function(po) {
                po.status = "Requested";
                po.createdBy = auth.employeeId;
                po.requestProductTo = purchaseOrder.requestProductTo;
                po.branchId = purchaseOrder.branchId;
                po.supplierId = po.supplierId;
                if (auth.role !== "KS_RS001") {
                    po.branchType = self.branchType[0].outletType.outletType;
                }
                dataService.saveData(url, po).then(successHandler, errorHandler);
            });
    }
        /**
         * createPO function is used to group by supplier the purchase product using mapping function
         * @param productDetails
         */
        function createPO(productDetails) {
            var result = _.chain(productDetails).groupBy("supplierId").pairs().map(function(currentItem) {
                    return _.object(_.zip(["supplierId", "productDetail"], currentItem));
                })
                .value();
            return result;
        }
        /**
         * Disable before dates for delivery date .
         * @param $view to set datepicker view
         * @param $dates to show dates in datepicker
         */
        function endDateOnSetTime() {
            $scope.$broadcast('end-date-changed');
        }

        function endDateBeforeRender($view, $dates) {
            var activeDate = moment(new Date()).subtract(1, $view).add(1, 'minute');
            $dates.filter(function(date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function(date) {
                date.selectable = false;
            })
        }
        /**
         * Error Notification
         * @param {String} e - displaying error notification while running employee list controller
         */
        function errorHandler(e) {
            console.log(e.toString());
        }

        function successHandler(responseData) {
            $state.go('root.purchase-order-list');
        }
        init();
    }

}());