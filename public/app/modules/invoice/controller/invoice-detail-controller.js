    /**
     * Invoice Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('invoice')
            .controller('invoiceDetailController', InvoiceDetailController)
        InvoiceDetailController.$inject = ['commonService', 'dataService', '$state', 'ksAlertService', '$stateParams', 'products', 'outlets', 'suppliers', 'menu', 'menus', 'units', 'franchisebranchs'];

        /**
         * @memberof module:Invoice
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $state
         * @requires ksAlertService
         * @requires $stateParams
         * @requires products
         * @requires outlets
         * @requires menu
         * @requires units
         * @requires franchisebranchs
         * @ngInject
         */

        function InvoiceDetailController(commonService, dataService, $state, ksAlertService, $stateParams, products, outlets, suppliers, menu, menus, units, franchisebranchs) {
            var self = this,
                url = '/api/invoices',
                data, receipt, copyReceipt;
            self.disableSubmit = disableSubmit; // Disables the fields in form page.
            self.addPayment = addPayment;
            self.reset = reset;
            self.invoiceReceiptupload = invoiceReceiptupload;
            self.addInvoice = addInvoice;
            self.updateInvoice = updateInvoice;
            self.paymentCalculation = paymentCalculation;
            self.formValidation = commonService.formValidation;
            self.print = commonService.print;
            self.invoice = {};

            function init() {
                self.outlets = outlets;
                self.suppliers = suppliers;
                self.franchisebranchs = franchisebranchs;
            }
            /**
             * While passing the object data it validate the empty object or not and,
             * returns the value.
             * @param obj
             */
            function isEmptyobj(obj) {
                for (var x in obj) {
                    return false;
                }
                return true;
            }
            /**
             * To set the details in edit mode
             * @param invoice
             */
            function setData(invoice) {
                data = invoice;
                self.invoice = angular.copy(data);
                copyReceipt = self.invoice.receipt;
                if (isEmptyobj(data)) {
                    checkPaymentDetails();
                }
            }
            /**
             * Reset the values in the summary list
             */
            function reset() {
                setData(data);
            }
            /**
             * Sending current state url for find data
             */
            var stateURL = $state.href($state.current.name);
            var urlId = stateURL.substring(stateURL.indexOf("e/") + 1);
            var urlSubstring = urlId.substring(1);
            if (urlSubstring.charAt(0) === 'K') {
                getInvoiceDetails();
            } else {
                getInvoicePaymentDetails();
            }
            /**
             * Get the invoice details based on Id using data service passing the URL.
             * On success call getting all invoice details in a summary list
             */
            function getInvoicePaymentDetails() {

                self.isEditmode = commonService.isEditMode();

                if (self.isEditmode === true) {
                    commonService.getDataById(url).then(function(invoice) { //passing the GET URL by its Id into dataService,while its sucesss will returns the data
                        if (invoice.menuDetails === undefined) {
                            self.detail = false;
                        } else {
                            self.detail = true;
                        }
                        var branchDetails = outlets.concat(franchisebranchs);
                        var outletDetail = branchDetails.filter(function(outlet) {
                            return (invoice.branchId === outlet.branchId);
                        })
                        invoice.branchName = outletDetail[0].branchName;
                        if (invoice.supplier === true) {
                            var supplierDetail = suppliers.filter(function(supplier) {
                                return (invoice.supplierId === supplier.supplierId);
                            })
                            invoice.supplierName = supplierDetail[0].supplierName;
                        }
                        setData(invoice);
                    });
                } else {
                    checkPaymentDetails();
                }
            }
            /**
             * Get the purchaseOrder details based on Id in invoice collection data service passing the URL.
             * On success call getting all purchaseOrder details in invoice page
             */
            function getInvoiceDetails() {
                self.isEditmode = commonService.isEditMode();
                var pourl = '/api/purchaseOrderDetails';
                if (self.isEditmode === true) {
                    return dataService.getDataById(pourl, $stateParams.id).then(successHandler, errorHandler); //passing the GET URL into dataService,while its sucesss will returns the data
                }

                function successHandler(responseData) {
                    self.poDetails = responseData;
                //    var str = self.poDetails._id;
                //  //  alert('ID number: ' + id);
                //    var res = 'KS_P0_'+Math.random().toString(12).substring(10);
                //    console.log(res);
                    self.invoice.purchaseOrderId = self.poDetails._id;
                    self.invoice.invoiceNo = self.poDetails.purchaseOrderId;
                    //self.invoice.poId = str.split(self.poDetails._id);
                    self.invoice.branchId = self.poDetails.branchId;
                    self.invoice.subTotal = 0;
                    if (self.poDetails.menuDetail.length == 0) {
                        self.detail = false;
                        var productDetails = [];
                        angular.forEach(self.poDetails.productDetail, function(poProduct) {
                            var invoiceProduct = {};
                            invoiceProduct["productId"] = poProduct.productId;
                            invoiceProduct["qty"] = poProduct.newOrderQty;
                            invoiceProduct["unitPrice"] = poProduct.unitPrice;
                            invoiceProduct["total"] = (poProduct.newOrderQty) * (poProduct.unitPrice);
                            invoiceProduct["unitId"] = poProduct.unitId;
                            self.invoice.subTotal = self.invoice.subTotal + invoiceProduct.total;
                            self.invoice.totalAmount = self.invoice.subTotal;

                            if (self.poDetails.requestProductTo === 'Supplier') {
                                self.invoice.supplierId = self.poDetails.supplierId;
                                self.invoice.supplier = true;
                            } else {
                                self.invoice.supplier = false;
                            }
                            angular.forEach(products, function(product) {
                                if (poProduct.productId === product.productId) {
                                    invoiceProduct["productName"] = product.productName;
                                }
                            });
                            angular.forEach(units, function(unit) {
                                if (poProduct.unitId === unit.unitId) {
                                    invoiceProduct["unitName"] = unit.unitName;
                                }
                            });
                            angular.forEach(suppliers, function(supplier) {
                                if (poProduct.supplierId === supplier.supplierId) {
                                    invoiceProduct["supplierId"] = supplier.supplierName;
                                    if (supplier.gst === true ) {
                                        invoiceProduct["gst"] = 7;
                                        self.invoice.gst = ((7 / 100) * self.invoice.totalAmount);
                                    }
                                }
                            });
                            productDetails.push(invoiceProduct);
                        });
                        self.invoice.productDetails = productDetails;
                    } else {
                        self.detail = true;
                        var menuDetails = [];
                        angular.forEach(self.poDetails.menuDetail, function(menu) {
                            var invoiceMenu = {};
                            invoiceMenu["menuId"] = menu.itemId;
                            invoiceMenu["qty"] = menu.qty;
                            invoiceMenu["unitPrice"] = menu.unitPrice;
                            invoiceMenu["total"] = (menu.qty) * (menu.unitPrice);
                            self.invoice.subTotal = self.invoice.subTotal + invoiceMenu.total;
                            self.invoice.totalAmount = self.invoice.subTotal;
                            invoiceMenu["unitId"] = menu.unitId;
                            angular.forEach(menus, function(menuDetail) {
                                if (menu.itemId === menuDetail.menuId) {
                                    invoiceMenu["menuName"] = menuDetail.itemName;
                                }
                            });
                            angular.forEach(units, function(unit) {
                                if (menu.unitId === unit.unitId) {
                                    invoiceMenu["unitName"] = unit.unitName;
                                }
                            });
                            menuDetails.push(invoiceMenu);
                        });
                        self.invoice.menuDetails = menuDetails;
                    }
                    data = angular.copy(self.invoice);
                    checkPaymentDetails();
                }
            }
            /**
             * Calculating the payment values which getting in purchaseOrder table based on,
             * this collection payment Calculation will be placed.
             *  @param subTotal
             *  @param payments
             */
            function paymentCalculation(subTotal, payments) {
                for (var i = 0; i < payments.length; i++) {
                    var value = payments[i];
                    if (payments.length > 1) {
                        var x = payments.length - 2;
                        var y = payments.length - 1;
                        payments[y].balance = payments[x].balance - payments[y].paidAmount;
                        if (payments[y].balance == 0) {
                            self.invoice.status = "Paid";
                        } else {
                            self.invoice.status = "Partially Paid";
                        }
                    } else {
                        value.balance = subTotal - value.paidAmount;
                        if (value.balance == 0) {
                            self.invoice.status = "Paid";
                        } else {
                            self.invoice.status = "Partially Paid";
                        }
                    }
                    if (urlSubstring.charAt(0) === 'K') {
                        if (value.paidAmount > subTotal) {
                            ksAlertService.warn('Paid amount is great than invoice amount');
                        }
                    } else {
                        if (payments[y].paidAmount > payments[x].balance) {
                            ksAlertService.warn('Paid amount is great than invoice amount');
                        }
                    }
                }
            }

            //Check the Invoice payments based on create the payments details array
            function checkPaymentDetails() {
                if (self.invoice && !self.invoice.payment) {
                    self.invoice.payments = [];
                    self.addPayment(self.invoice.payments);
                }
            }
            /**
             * Add the payments ng-model values into the payments array.
             * @params payments
             */
            function addPayment(payments) {
                var date = new Date();
                date.setHours(0, 0, 0, 0);
                payments.push({
                    date: date,
                    paidAmount: '',
                    balance: ''
                });
            }
            // On click disableSubmit function which changes into enable field. 
            function disableSubmit() {
                this.submitbut = false;
            }
            //Error function
            function errorHandler(e) {
                console.log(e.toString());
            }
            //Get the receipt based on the id
            document.getElementById('receipt').addEventListener("change", invoiceReceiptupload, false);
            /**
             * On event trigger function read the image file,
             * store in array
             * @param event
             */
            function invoiceReceiptupload(event) {
                receipt = [];
                if (urlSubstring.charAt(0) !== 'K') {
                    for (var i = 0; i < copyReceipt.length; i++) {
                        receipt.push(copyReceipt[i]);
                    }
                }
                var files = event.target.files; //FileList object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        receipt.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
            /**
             * Add the invoice details using data service passing the URL.
             * Its first validate the invoice details and allow to add data.
             * On success call getting all invoice details in a summary list.
             * @param invoice
             */
            function addInvoice(invoice) {

                var branchDetails = outlets.concat(franchisebranchs);
                var branch = branchDetails.filter(function(branch) {
                    return (branch.branchId == invoice.branchId);
                });
                var franchiseDetails = {};
                if ((branch[0].outletType != undefined) && (branch[0].outletType.outletType === 'Franchise')) {
                    franchiseDetails.franchise = true;
                    franchiseDetails.franchiseId = branch[0].branchId;
                } else if (branch[0].franchiseId != undefined) {
                    franchiseDetails.franchise = true;
                    franchiseDetails.franchiseId = branch[0].franchiseId;
                } else {
                    franchiseDetails.franchise = false;
                }
                self.invoice.franchise = franchiseDetails;

                self.invoice.totalAmount = self.invoice.totalAmount;
                self.invoice.gst = self.invoice.gst;
                self.invoice.status = self.invoice.status;

                self.invoice.receipt = receipt;

                if (self.invoice.receipt != undefined) {
                    dataService.saveData(url, invoice).then(successHandler, errorHandler); //passing the  POST URL to dataService ,its sucesss returns the data
                } else {
                    ksAlertService.warn('Please upload the receipt');
                }

                function successHandler(responseData) {
                    $state.go('root.invoice_list');
                }
            }
            /**
             * Update the invoice details using data service passing the URL.
             * Its first validate the invoice details and allow to update data.
             * On success call getting all invoice details in a summary list.
             * @param invoice
             */
            function updateInvoice(invoice) {
                copyReceipt
                self.invoice.totalAmount = self.invoice.totalAmount;
                self.invoice.gst = self.invoice.gst;
                self.invoice.status = self.invoice.status;

                self.invoice.receipt = receipt;

                if (self.invoice.receipt != undefined) {
                    dataService.updateData(url, invoice._id, invoice).then(successHandler, errorHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data
                } else {
                    ksAlertService.warn('Please upload the receipt');
                }

                function successHandler(responseData) {
                    $state.go('root.invoice_list');
                }
            }
            init();
        }
    }());