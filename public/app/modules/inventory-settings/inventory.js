(function() {
    'use strict';
    angular.module('inventory', ['app'])
        .config(Config);
    Config.$inject = ['$stateProvider'];

    /**
     * @memberof module:Inventory Settings
     *
     * This function is for appending the state to show view (ie)Appending the state
     * and also resoving other routes need for the page.
     * @requires $stateProvider
     * @requires Inject 
     */
    function Config($stateProvider) {
        $stateProvider
            //Add and edit the Inventory Details
            .state('root.addinventory', {
                url: '/addinventory/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-settings/views/inventory.html',
                        controller: 'inventoryAddController',
                        controllerAs: 'invtryCtrl',
                        resolve: {

                            product: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            unit: function(dataService) {
                                return dataService.getData('/api/units');
                            },
                            outlet: function(dataService) {
                                return dataService.getData('/api/outlets');
                            }
                        }
                    }
                }
            })
            //Inventory List
            .state('root.inventorylist', {
                url: '/inventorylist',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-settings/views/inventorylist.html',
                        controller: 'inventoryListController',
                        controllerAs: 'invtryLstCtrl',
                        resolve: {
                            product: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            unit: function(dataService) {
                                return dataService.getData('/api/units');
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
            //Supplied Product Details
            .state('root.product-suppliedReport', {
                url: '/product-suppliedReport',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-report/views/product-supplied-report.html',
                        controller: 'productsuppliedDetailController',
                        controllerAs: 'psdc',
                        resolve: {
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                            suppliers: function(dataService) {
                                return dataService.getData('/api/suppliers');
                            },
                             outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches:function(dataService) {
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
            //Supplied Menu Details
            .state('root.menu-suppliedReport', {
                url: '/menu-suppliedReport',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-report/views/menu-supplied-report.html',
                        controller: 'menuSuppliedDetailController',
                        controllerAs: 'msdc',
                        resolve: {
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                                     outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches:function(dataService) {
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
            //Received product Details
            .state('root.receivedReport', {
                url: '/receivedReport',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-report/views/product-received-report.html',
                        controller: 'receivedDetailController',
                        controllerAs: 'rdpc',
                        resolve: {
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                            reportDetails: function(dataService) {
                                return dataService.getData('/api/receivedByProductReport');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches:function(dataService) {
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
            //Received Menu details
            .state('root.menuReceivedReport', {
                url: '/menuReceivedReport',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/inventory-report/views/menu-received-report.html',
                        controller: 'receivedDetailController',
                        controllerAs: 'rdmc',
                        resolve: {
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                            reportDetails: function(dataService) {
                                return dataService.getData('/api/receivedByMenuReport');
                            },
                                 outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchiseBranches:function(dataService) {
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
    }
}());