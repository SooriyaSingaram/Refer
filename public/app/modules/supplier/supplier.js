/**
 * Supplier Router Module
 */
(function() {

    'use strict';

    angular.module('supplier', ['app.data', 'ui.router', 'ui.bootstrap'])
           .config(Config);

    Config.$inject = ['$stateProvider'];
    /**
     * @memberof module:supplier
     
     * UI Router presents for state reference within module.
     * @requires app.data
     * @requires ui.router
     * @requires ui.bootstrap
     * @ngInject $stateProvider
     */
    function Config($stateProvider) {
        $stateProvider
            // Supplier 
            .state('root.supplier', {
                url: '/supplier/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/supplier/view/supplier.html',
                        controller: 'supplierDetailController',
                        controllerAs: 'sdc',
                        resolve: {
                            countryCodes: function(commonService) {
                                return commonService.getCountryCode();
                            }
                        }
                    }
                }
            })
            //Supplier List
            .state('root.supplier_list', {
                url: '/supplier_list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/supplier/view/supplier-list.html',
                        controller: 'supplierListController',
                        controllerAs: 'slc',
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
                            }
                        }
                    }
                }
            })
             //Supplier Report
            .state('root.supplier-report', {
                url: '/supplier-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/supplier/view/supplier-report.html',
                        controller: 'supplierReportController',
                        controllerAs: 'src',
                        resolve: {
                            suppliers: function(dataService){
                                return dataService.getData('/api/suppliers');
                            },
                            supplierReport: function(dataService) {
                                return dataService.getData('/api/supplierReport');
                            }

                        }
                    }
                }
            })
    }

}());