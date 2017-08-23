/**
 * Configuration Router Module
 */
(function() {

    'use strict';

    angular.module('configuration', ['app.data', 'ui.router', 'ui.bootstrap'])
        .config(Config);

    Config.$inject = ['$stateProvider'];
    /**
     * @memberof module:configuration
     
     * UI Router presents for state reference within module.
     * @requires app.data
     * @requires ui.router
     * @requires ui.bootstrap
     * @ngInject $stateProvider
     */
    function Config($stateProvider) {
        $stateProvider
        // Product Configuration 
            .state('root.productconfig', {
                url: '/productconfig',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/product-config-dashboard.html'
                    }
                }
            })
            // Category
            .state('root.category', {
                url: '/category',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/category.html',
                        controller: "categoryController",
                        controllerAs: "categoryLC",
                        resolve: {
                            subCategory: function(dataService) {
                                return dataService.getData('/api/subcategories');
                            }
                        }
                    }
                }
            })
            // Sub Category 
            .state('root.subcategory', {
                url: '/subcategory',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/subcategory.html',
                        controller: 'subCategoryController',
                        controllerAs: "subCategoryLC",
                        resolve: {
                            product: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            category: function(dataService) {
                                return dataService.getData('/api/categories');
                            }
                        }

                    }
                }
            })
            // Unit
            .state('root.units', {
                url: '/units',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/unit.html',
                        controller: 'unitController',
                        controllerAs: "unitLC",
                        resolve: {
                            product: function(dataService) {
                                return dataService.getData('/api/products');
                            },
                            menu: function(dataService) {
                                return dataService.getData('/api/menus');
                            }
                        }

                    }
                }
            })
            // Outlet Configuration
            .state('root.outletconfig', {
                url: '/outletconfig',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/outlet-config-dashboard.html'
                    }
                }

            })
            // Request Type
            .state('root.requesttype', {
                url: '/requesttype',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/request-type.html',
                        controller: 'configurationController',
                        controllerAs: 'rtc',
                        resolve: {
                            configSetting: function() {
                                return {
                                    configType: 'requestType',
                                    configProperties: ['requestId', 'requestName'],
                                    configModelKey: 'KS_RT'
                                }
                            }
                        }

                    }
                }
            })
            // Complaint Type
            .state('root.complainttype', {
                url: '/complainttype',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/complaint-type.html',
                        controller: 'complaintTypeController',
                        controllerAs: 'ctc'
                    }
                }

            })
            // Menu Configuration 
            .state('root.menuconfig', {
                url: '/menuconfig',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/menu-config-dashboard.html'
                    }
                }

            })
            // Menu Category
            .state('root.menucategory', {
                url: '/menucategory',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/menu-category.html',
                        controller: "menuCategoryController",
                        controllerAs: "menucategoryLC",
                        resolve: {
                            menu: function(dataService) {
                                return dataService.getData('/api/menus');
                            }
                        }

                    }

                }

            })
             // Labour cost
            .state('root.labourcost', {
                url: '/labourcost',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/labourcost.html',
                        controller: "labourcostController",
                        controllerAs: "LCC",
                        resolve: {
                            menu: function(dataService) {
                                return dataService.getData('/api/menus');
                            }
                        }
                    }

                }

            })
             // OverHeadPrice
            .state('root.overheadcost', {
                url: '/overheadcost',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/over-head-cost.html',
                        controller: "overheadpriceController",
                        controllerAs: "OHPC",
                        resolve: {
                            menu: function(dataService) {
                                return dataService.getData('/api/menus');
                            }
                        }
                    }

                }

            })
            // HRM Configuration 
            .state('root.hrmconfig', {
                url: '/hrmconfig',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/hrm-config-dashboard.html'
                    }
                }

            })
            // Nationality
            .state('root.nationality', {
                url: '/nationality',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/nationality.html',
                        controller: 'configurationController',
                        controllerAs: 'hrm',
                        resolve: {
                            configSetting: function() {
                                return {
                                    configType: 'nationalities',
                                    configProperties: ['nationalityId','nationalityName'],
                                    configModelKey: 'AP_N'
                                }
                            }
                        }
                    }
                }

            })
            // Role Setup
            .state('root.rolesetup', {
                url: '/rolesetup',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/role-setup.html',
                        controller: 'roleSetupController',
                        controllerAs: 'rsc'
                    }
                }

            })
            // Residential
            .state('root.residential', {
                url: '/residential',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/configuration/view/residential.html',
                        controller: 'configurationController',
                        controllerAs: 'hrm',
                        resolve: {
                            configSetting: function() {
                                return {
                                    configType: 'residentials',
                                    configProperties: ['residentialId', 'residentialName'],
                                    configModelKey: 'AP_RE'
                                }
                            }
                        }
                    }
                }

            })
    }

}());



