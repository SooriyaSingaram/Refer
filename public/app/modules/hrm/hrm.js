/**
 * Hrm Module
 */
(function() {
    'use strict';
    angular
        .module('hrm', ['app.data', 'ui.router'])
        .config(Config);

    Config.$inject = ['$stateProvider'];
    /**
         * @memberof module:hrm
         
         * UI Router presents for state reference within module.
         * @requires app.data
         * @requires ui.router
         * @ngInject $stateProvider
         */
    function Config($stateProvider) {
        $stateProvider
            // Employee
            .state('root.employee', {
                url: '/employee/:id',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/hrm/view/employee.html',
                        controller: 'employeeDetailController',
                        controllerAs: 'edc',
                        resolve: {
                            configuration: function(dataService) {
                                return dataService.getData('/api/configuration');
                            },
                            role: function(dataService) {
                                return dataService.getData('/api/rolesetups');
                            },
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            countryCodes: function(commonService) {
                                return commonService.getCountryCode();
                            }
                        }

                    }
                }

            })
            // Employee List
            .state('root.employee-list', {
                url: '/employee-list',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/hrm/view/employee_list.html',
                        controller: 'employeeListController',
                        controllerAs: 'elc',
                        resolve: {
                            outlets: function(dataService) {
                                return dataService.getData('/api/outlets');
                            },
                            franchise: function(dataService) {
                                return dataService.getData('/api/franchisebranchs');
                            },
                            role: function(dataService) {
                                return dataService.getData('/api/rolesetups');
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