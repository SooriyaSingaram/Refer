/**
 * Purchase Order
 */
(function() {
    'use strict';
    angular
        .module('purchase-order', ['app.data', 'ui.router'])
        .config(Config);

    Config.$inject = ['$stateProvider'];
    /**
         * @memberof module:purchase-order
         
         * UI Router presents for state reference within module.
         * @requires app.data
         * @requires ui.router
         * @ngInject $stateProvider
         */
    function Config($stateProvider) {
        $stateProvider
            // purchase order list
            .state('root.purchase-order-list', {
                url: '/purchase-order-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-list.html',
                        controller: 'purchaseOrderListController',
                        controllerAs: 'pol',
                        resolve: {
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            invoices: function(dataService) {
                                return dataService.getData('/api/invoices');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            }
                        }
                    }
                }

            })
            //purchase order update
            .state('root.purchase-order-update', {
                url: '/purchase-order-update',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-update.html',
                        controller: 'purchaseOrderListController',
                        controllerAs: 'pol',
                        resolve: {
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            }
                        }
                    }
                }

            })
            //purchase order view
            .state('root.receiving-goods', {
                url: '/receiving-goods/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/po-received.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel : function(dataService){
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                }
            }) //purchase order view
            .state('root.purchase-order-view', {
                url: '/purchase-order-view/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-view.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel: function(dataService) {
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                }
            })
            // Create PO
            .state('root.purchase-order', {
                url: '/purchase-order/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel: function(dataService) {
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                }
            })
            // Copy PO
            .state('root.purchase-order-copy', {
                url: '/purchase-order-copy/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/copy-PO.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel: function(dataService) {
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }

                        }
                    }
                }
            })
            // Update PO Product 
            .state('root.update-po-product', {
                url: '/update-po-product/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/update-po-product.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel: function(dataService) {
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                }
            })
            .state('root.purchase-order-warehouse', {
                url: '/purchase-order-warehouse/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-warehouse.html',
                        controller: 'purchaseOrderDetailController',
                        controllerAs: 'poc',
                        resolve: {
                            menus: function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            supplierdetails: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            inventorylevel: function(dataService) {
                                return dataService.getData('/api/inventorysettings');
                            },
                            units : function(dataService){
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                }
            })
            //Purchase order Performance Report
            .state('root.purchase-performance-report', {
                url: '/purchase-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-report.html',
                        controller: 'purchaseOrderReportController',
                        controllerAs: 'porc',
                        resolve: {
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            reportDetails: function(dataService) {
                                return dataService.getData('/api/purchaseorders');
                            },
                            products: function(dataService) {
                                var product = {};
                                product.id = 'all';
                                return dataService.getDataFilterBy('/api/products', product);
                            },
                           auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                        }
                    }
                }

            })
            //Purchase order Payment Report
            .state('root.purchaseOrder-payment-report', {
                url: '/purchaseOrder-payment-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/purchase-order-payment-report.html',
                        controller: 'purchaseOrderReportController',
                        controllerAs: 'poprc',
                        resolve: {
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            reportDetails: function(dataService) {
                                return dataService.getData('/api/purchaseOrdersPaymentReport');
                            },
                            products: function(dataService) {
                                var product = {};
                                product.id = 'all';
                                return dataService.getDataFilterBy('/api/products', product);
                            },
                         auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                        }
                    }
                }

            })
            //Purchase order selling report
            .state('root.selling-report', {
                url: '/selling-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/purchase-order/view/selling-report.html',
                        controller: 'purchaseOrderReportController',
                        controllerAs: 'src',
                        resolve: {
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            reportDetails: function(dataService) {
                                return dataService.getData('/api/purchaseOrdersSellingReport');
                            },
                            products: function(dataService) {
                                var product = {};
                                product.id = 'all';
                                return dataService.getDataFilterBy('/api/products', product);
                            },
                          auth: function($q, authService) {
                                var userToken = authService.getUserInfo();
                                if (userToken) {
                                    return $q.when(userToken);
                                } else {
                                    return $q.reject({
                                        authenticated: false
                                    });
                                }
                            },
                                        
                        }
                    }
                }

            })
    }

}());