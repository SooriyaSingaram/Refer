(function() {

    'use strict';

    angular.module('invoice', ['app.data', 'ui.router', 'ui.bootstrap'])
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('root.invoice', {
                url: '/invoice/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/invoice/view/invoice.html',
                        controller:'invoiceDetailController',
                        controllerAs:'idc',
                        resolve: {
                           products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchisebranchs: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },  
                            suppliers: function(dataService){
                                return dataService.getData('/api/suppliers')
                            },
                            menu:function(dataService) {
                                return dataService.getData('/api/menuDetails');
                            },
                            menus:function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            units:function(dataService) {
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                } 

            })
            .state('root.invoice_list', {
                url: '/invoice_list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/invoice/view/invoice-list.html',
                        controller:'invoiceListController',
                        controllerAs:'ilc',
                        resolve: {
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
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchisebranchs: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            } 
                        }
                    }
                }
            })
            .state('root.printInvoice', {
                url: '/printinvoice/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/invoice/view/print-invoice.html',
                        controller:'invoiceDetailController',
                        controllerAs:'idc',
                        resolve: {
                            products: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchisebranchs: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },  
                            suppliers: function(dataService){
                                return dataService.getData('/api/suppliers')
                            },
                            menu:function(dataService) {
                                return dataService.getData('/api/menuDetails');
                            },
                            menus:function(dataService) {
                                return dataService.getData('/api/menus');
                            },
                            units:function(dataService) {
                                return dataService.getData('/api/units');
                            }
                        }
                    }
                } 

            })
    }

}());
