/**
 * menu module
 */
(function() {
    'use strict';
    angular.module('menu', ['app.data', 'ui.router'])
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            //Create and Edit menu
            .state('root.menu', {
                url: '/menu/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/menu/view/menu.html',
                        controller: 'menuDetailController',
                        controllerAs: 'mdc',
                        resolve: {
                            units: function(dataService) {
                                return dataService.getData('/api/units');
                            },
                            menucategory: function(dataService) {
                                return dataService.getData('/api/menucategories');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            products: function(dataService) {
                                return dataService.getData('/api/products')
                            },
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                            labourcosts : function(dataService) {
                                return dataService.getData('/api/labourcost');
                            },
                            overheadprice : function(dataService) {
                                return dataService.getData('/api/overheadprices');
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
            //Menu List
            .state('root.menu-list', {
                url: '/menu-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/menu/view/menu-list.html',
                        controller: 'menuListController',
                        controllerAs: 'mlc',
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
            // Menu  Profit report
            .state('root.menu-report', {
                url: '/menu-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/menu/view/menu-profit-report.html',
                        controller: 'menuReportController',
                        controllerAs: 'mrc',
                        resolve: {
                            menuReport: function(dataService) {
                                return dataService.getData('/api/menuDetails');
                            }
                        }
                    }
                }
            })
            //Monthly Menu report
            // .state('root.monthly-menu-report', {
            //     url: '/monthly-menu-report',
            //     views: {
            //         'content@': {
            //             templateUrl: '/app/modules/menu/view/monthly-po-menuReport.html',
            //             controller: 'menuReportController',
            //             controllerAs: 'mmrc',
            //             resolve: {
            //                 menuReport: function(dataService) {


            //                     return dataService.getData('/api/menuReport');

            //                 }
            //             }
            //         }
            //     }
            // })
            //Top sold Menu report
            // .state('root.topsold-menu-report', {
            //     url: '/topsold-menu-report',
            //     views: {
            //         'content@': {
            //             templateUrl: '/app/modules/menu/view/top-sold-menu.html',
            //             controller: 'menuReportController',
            //             controllerAs: 'tsmr',
            //             resolve: {
            //                 menuReport: function(dataService) {


            //                     return dataService.getData('/api/topsoldmenu');

            //                 }
            //             }
            //         }
            //     }
            // })
    }

}());