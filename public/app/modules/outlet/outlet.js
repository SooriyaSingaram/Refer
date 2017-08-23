/**
 * Outlet 
 */
(function() {
    'use strict';
    angular.module('outlet', ['app.data', 'ui.router'])
        .config(Config);

    Config.$inject = ['$stateProvider'];

    /**
     * @memberof module:outlet
     * 
     * Routes the outlet module
     * @requires app.data
     * @requires $stateProvider
     * @requires ui.router
     */

    function Config($stateProvider) {
        $stateProvider
        //Outlet DashBoard
            .state('root.outlet-dashboard', {
                url: '/outlet-dashboard',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/outlet-dashboard.html',
                    }
                }
            })
        //Outlet
            .state('root.outlet', {
                url: '/outlet/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/outlet.html',
                        controller: 'outletDetailController',
                        controllerAs: 'odc',
                        resolve: {
                            countryCodes: function(commonService) {
                                return commonService.getCountryCode();
                            },
                            franchiseBranches: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            }
                        }
                    }
                }

            })
            //outlet List
            .state('root.outlet-list', {
                url: '/outlet-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/outlet-list.html',
                        controller: 'outletListController',
                        controllerAs: 'olc',
                        resolve: {
                            franchiseBranches: function(dataService) {
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
            //Franchise Branch
            .state('root.franchiseBranch', {
                url: '/franchiseBranch/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/franchise-branch.html',
                        controller: 'franchiseBranchDetailController',
                        controllerAs: 'fbdc',
                        resolve: {
                            countryCodes: function(commonService) {
                                return commonService.getCountryCode();
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            }
                        }
                    }
                }
            })
            //Franchise Branch List
            .state('root.franchise-branch-list', {
                url: '/franchise-branch-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/franchise-branch-list.html',
                        controller: 'franchiseBranchListController',
                        controllerAs: 'fblc',
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
            //Emergency Contact List
            .state('root.emergency-contact-list', {
                url: '/emergency-contact-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/emergency-contact-list.html',
                        controller: 'outletListController',
                        controllerAs: 'olc',
                        resolve: {
                            franchiseBranches: function(dataService) {
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
            //Daily Occurrences
            .state('root.daily-occurrences', {
                url: '/daily-occurrences/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/daily-occurrences.html',
                        controller: 'dailyOccurrencesController',
                        controllerAs: 'doc',
                        resolve: {
                            complaints: function(dataService) {
                                return dataService.getData('/api/complainttypes');
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
                           roles: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            }                        }
                    }
                }
            })
            //Daily Occurrences List
            .state('root.daily-occurrences-list', {
                url: '/daily-occurrences-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/daily-occurrences-list.html',
                        controller: 'dailyOccurrencesListController',
                        controllerAs: 'dlc',
                        resolve: {
                            complaints: function(dataService) {
                                return dataService.getData('/api//complainttypes');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchises: function(dataService) {
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
            //Request 
            .state('root.request', {
                url: '/request/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/request.html',
                        controller: 'requestController',
                        controllerAs: 'rc',
                        resolve: {
                            request: function(dataService) {
                                return dataService.getData('/api/configuration');
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
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            }       
                        }
                    }
                }
            })

            //Request Type List
            .state('root.request-list', {
                url: '/request-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/request-list.html',
                        controller: 'requestListController',
                        controllerAs: 'rlc',
                        resolve: {
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            },
                            franchises: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
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
             //Daily Occurence report
            .state('root.daily-occurrences-report', {
                url: '/daily-occurrences-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/outlet/view/daily-occurrences-report.html',
                        controller: 'dailyOccurrencesListController',
                        controllerAs: 'drc',
                        resolve: {
                            complaints: function(dataService) {
                                return dataService.getData('/api/complainttypes');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                        franchises: function(dataService) {
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