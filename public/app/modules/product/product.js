/**
 * Product Router Module
 */
(function() {
    'use strict';
    angular.module('product', ['app.data', 'ui.router', 'ui.bootstrap'])
        .config(Config);

    Config.$inject = ['$stateProvider'];
    /**
     * @memberof module:product
     
     * UI Router presents for state reference within module.
     * @requires app.data
     * @requires ui.router
     * @requires ui.bootstrap
     * @ngInject $stateProvider
     */
    function Config($stateProvider) {
        $stateProvider
            // Product 
            //Product Dahboard
            .state('root.product-dashboard', {
                url: '/product-dashboard',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/product/view/product-dashboard.html',
                    }
                }
            })
            .state('root.product', {
                url: '/product/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/product/view/product.html',
                        controller: 'productDetailController',
                        controllerAs: 'pdc',
                        resolve: {
                            supplier: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                            category: function(dataService) {
                                return dataService.getData('/api/categories');
                            },
                            subCategory: function(dataService) {
                                return dataService.getData('/api/subcategories');
                            },
                            units: function(dataService) {
                                return dataService.getData('/api/units');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            }
                        }
                    }
                }
            })
            //Product List
            .state('root.product-list', {
                url: '/product-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/product/view/product-list.html',
                        controller: 'productListController',
                        controllerAs: 'plc',
                        resolve: {
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
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
            //Expiry Product Report
            // .state('root.expiry-report', {
            //     url: '/expiry-report',
            //     views: {
            //         'content@': {
            //             templateUrl: '/app/modules/product/view/expiry-report.html',
            //             controller: 'productReportController',
            //             controllerAs: 'erc',
            //             resolve: {
            //                 productReport: function(dataService) {
            //                     return dataService.getData('/api/expiryProduct');
            //                 }
            //             }
            //         }
            //     }
            // })
            //Monthly purchase product Report
            .state('root.monthly-purchase-report', {
                url: '/monthly-purchase-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/product/view/monthly-po-product-report.html',
                        controller: 'productReportController',
                        controllerAs: 'mpr',
                        resolve: {
                            productReport: function(dataService) {
                                return dataService.getData('/api/productReport');
                            }
                        }
                    }
                }
            })
            //Top sold product Report
            .state('root.topsold-product-report', {
                url: '/topsold-product-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/product/view/top-sold-report.html',
                        controller: 'productReportController',
                        controllerAs: 'tspc',
                        resolve: {
                            productReport: function(dataService) {
                                return dataService.getData('/api/topsoldProduct');
                            }
                        }
                    }
                }
            })
    }

}());