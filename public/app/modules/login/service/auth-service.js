/**
 * authService used for login
 */
(function() {
  'use strict';
  angular
    .module('app')
    .service('authService', AuthService)
  AuthService.$inject = ['$http', '$q', '$window'];
   /**
     * AuthService is used post user login details and getUserInfo details
     * @requires $http
     * @requires $q
     * @requires $window
     * @ngInject 
     */
  function AuthService($http, $q, $window) {
    var self = this;
    self.login = login;
    self.logout = logout;
    var userToken;
     /**
      * login by $http service passing the URL.
      * @params userName
      * @params password
    */
    function login(userName, password) {
      var deferred = $q.defer();
      $http.post("/api/login", { userName: userName, password: password })
        .then(function(result) {
          userToken = result.data.access_token;
          $window.localStorage["userToken"] = userToken;
          deferred.resolve(userToken);
        }, function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }
    /**
      * logout for remove the userToken session experied 
      * return @params userToken
    */
    function logout() {
      return $window.localStorage.removeItem("userToken");
    }
    /**
    * getUserInfo used to check usertoken placed in session then it create the payload
    */
    function getUserInfo() {
      if (userToken) {
        var payload = userToken.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        if (payload.exp > parseInt(new Date().getTime() / 1000)) {
          return payload;
        }
      }
      return false;
    }
    /**
    * getToken used to return the usertoken to login controller
    * return @param usertoken
    */
    function getToken() {
      return userToken;
    }
    /**
     * Initialize the usertoken in localstorge to access,its load the entire page
     */
    function init() {
      if ($window.localStorage["userToken"]) {
        userToken = $window.localStorage["userToken"];
      }
    }

    init();
    /**
     * retrun used return the function to login controller
     */
    return {
      login: login,
      logout: logout,
      getUserInfo: getUserInfo,
      getToken: getToken
    };
  }
}());