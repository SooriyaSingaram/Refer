/**
 * BankDeposit Router Module
 */
(function() {
    'use strict';
    angular.module('bankDeposit', ['app.data', 'ui.router', 'ui.bootstrap'])
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            //Bank deposit details Dashboard
            .state('root.bankDeposit-dashboard', {
                url: '/bankDeposit-dashboard',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/bank-deposit/view/bankDeposit-dashboard.html',
                    }
                }
            })
            //Add the Bank deposit Details
            .state('root.bankDeposit', {
                url: '/bankDeposit/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/bank-deposit/view/bankDeposit.html',
                        controller: 'bankDepositDetailController',
                        controllerAs: 'bdc',
                        resolve: {
                            franchiseBranches: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            employees: function(dataService) {
                                return dataService.getData('/api/employees');
                            }
                        }

                    }
                }

            })
            //Bank deposit details List
            .state('root.bankDeposit-list', {
                url: '/bankDeposit-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/bank-deposit/view/bankDeposit-list.html',
                        controller: 'bankDepositListController',
                        controllerAs: 'bdlc',
                        resolve: {
                            franchiseBranches: function(dataService) {
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
            //Bank deposit Details Report
            .state('root.bankDeposit-report', {
                url: '/bankDeposit-report',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/bank-deposit/view/bankDeposit-report.html',
                        controller: 'bankDepositListController',
                        controllerAs: 'bdrc',
                        resolve: {
                            franchiseBranches: function(dataService) {
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
    }

}());