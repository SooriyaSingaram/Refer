/**
 * login-controller
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('loginController', LoginController)
  LoginController.$inject = ['$state', '$rootScope', 'authService', 'ksAlertService', '$location'];
  /**
     * CRUD application is performed and also displays the data
     * in this login function placed by using authservice
     * @requires $state
     * @requires $rootScope
     * @requires authService
     * @requires ksAlertService
     * @requires $location
     * @ngInject 
     */
  function LoginController($state, $rootScope, authService, ksAlertService, $location) {
    /**
     * Initialize the all function,its load the entire page
     */
    var self = this;
    self.login = login;
    self.userToken = null;
    /**
     * logout function which work by injecting authservice.login()
     */
    function login() {
      authService.login(self.userName, self.password)
        .then(function(result) {
          self.userToken = result;
          $state.go('root.dashboard');
        }, function(error) {
          ksAlertService.error("Invalid credentials");
        });
    };
    app.run(["$rootScope", "$location","authService", function ($rootScope, $location,authService) {
        $rootScope.$on("$stateChangeSuccess", function (userToken) {
        });
        $rootScope.$on("$stateChangeError", function (event, current, previous, eventObj) {
            if (eventObj.authenticated === false) {
                $location.path("/");
            }
        });
        $rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
          if ($location.path() === '/' && authService.getUserInfo()) {
            $location.path('/');
          }
        });
    }]);

    /**
     * app.run is module which is used for redirect the page while not login
     * @requires $rootScope
     * @requires authService
     * @requires $location
     * @ngInject
     */
/*    app.run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
      $rootScope.$on('$stateChangeStart', function(event) {
        if (!authService.getUserInfo()) {
          event.preventDefault();
          $location.path('/login');
        } else {
          $location.path('/dashboard');
        }
      });
    }]);*/
  }
}());
