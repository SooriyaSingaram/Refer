/**
 * Data Service
 */
(function() {
    'use strict';
    angular
        .module('app.data')
        .service('dataService', DataService)

    DataService.$inject = ['$http', '$q','authService'];
    
    /**
     *  service for handling alerts. 
     *
     * @memberof module:app.data
     *
     * @requires $http
     * @requires $q
     * @requires authService
     * @ngInject
     */

    function DataService($http, $q,authService) {

        var self = this;

        self.getData = getData;
        self.saveData = saveData;
        self.updateData = updateData;
        self.getDataById = getDataById;
        self.deleteData= deleteData;
        self.getDataFilterBy=getDataFilterBy;



        //Getting Data Values in GET API
        function getData(url) {

           var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url: url,
                    headers: {
                      Authorization: 'Bearer ' + authService.getToken()
                    }
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }
        //Posting Data Values in POST API
        function saveData(url, data) {

            var deferred = $q.defer(),
                options = {
                    method: 'POST',
                    cache: false,
                    url: url,
                    data: data
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }
        //Getting Data Values in GET API based on data ID
        function getDataById(url, id) {

            var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url: url + '/' + id
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }
        // Get Data Values based on Id
        function deleteData(url,id) {
           
            var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url:url+'/'+id
                   
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }
        //Updating Data Values in PUT API
        function updateData(url, id, data) {
            var deferred = $q.defer(),
                options = {
                    method: 'PUT',
                    cache: false,
                    url: url + '/' + id,
                    data: data
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }

            function getDataFilterBy(url,data) {

            var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url: url,
                    params:data
                };

            function handleSuccess(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            }

            function handleError(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            }
            $http(options).success(handleSuccess).error(handleError);
            return deferred.promise;
        }

    }
}());