/**
 * home-controller
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('homeController', HomeController)
  HomeController.$inject = ['$state', 'authService', 'auth','commonService'];
   /**
     * CRUD application is performed and also displays the data
     * in this logout function placed by using authservice
     * @requires $state
     * @requires authService
     * @requires auth
     * @ngInject 
     */
  function HomeController($state, authService, auth,commonService) {
     /**
     * Initialize the all function,its load the entire page
     */
    var self = this;
    self.userToken = auth;
  
    self.logout = logout;

     /*init()-Initial funtions when onloading file*/
        function init() {
           
            authorization();
        }
    /**
    /**
    * logout function which work by injecting authservice.logout()
    */
    function logout() {
      authService.logout();
      $state.go('login')
    };

    function authorization(){
            var role = self.userToken.role;
            var rolesDetails = commonService.getRolesDetails().then(function(predefinedRoles) {
            var predefinedRoles = predefinedRoles;
            var accessRoles = predefinedRoles.filter(function ( accessRoles ) {
                  return accessRoles.role === role;
              })[0];             
             self.authorizeData=accessRoles.access;
                      },
                      function(data) {
                          console.log('JSON retrieval failed.')
                      });;
          }
          init();
  }
}());