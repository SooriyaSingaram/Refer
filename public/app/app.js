/**
 * Main Router Module
 */
var app = angular.module('app', ['app.data', 'configuration', 'hrm', 'outlet', 'menu', 'product','inventory','supplier','purchase-order', 'invoice', 'sales','bankDeposit','ui.router', 'ui-notification', 'ui.select', 'ui.bootstrap.datetimepicker']);

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');


    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            views: {
                'header': {
                    templateUrl: '/app/modules/home/header.html',
                    controller: 'homeController',
                    controllerAs: 'hc',
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
                },
               'left': {
                    templateUrl: '/app/modules/home/leftmenu.html',
                     controller: 'homeController',
                    controllerAs: 'hc',
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
                },
                'footer': {
                    templateUrl: '/app/modules/home/footer.html'
                }
            }
        })
        .state('login', {
            url: '/',
            views: {
                'login': {
                    templateUrl: '/app/modules/login/view/login.html',
                    controller: 'loginController',
                    controllerAs: 'lc'
                }
            }
        })
         .state('root.dashboard', {
            url: '/dashboard',
            views: {
                'content@': {
                    templateUrl: '/app/modules/home/content.html',
                    controller: 'homeController',
                    controllerAs: 'hc',
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
        .state('root.configsetting', {
            url: '/configsetting',
            views: {
                'content@': {
                    templateUrl: '/app/modules/home/config-dashboard.html'
                }
            }
        })
});