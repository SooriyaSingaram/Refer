/**
 * Interceptor
 */
(function() {

    'use strict';

    angular
        .module('app.data')
        .factory('httpInterceptor', KSInterceptor)
    /**
     * @memberof module:app.data
     *
     * intercept all the request,response of the app
     * @requires $q
     * @requires $rootScope
     * @requires $injector
     * @ngInject
     */
    function KSInterceptor($q, $rootScope, $injector) {

        var token, numLoadings = 0;
        return {
            request: function(config) {

                numLoadings++;
                // Show loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)

            },
            response: function(response) {
                var ksAlertService = $injector.get('ksAlertService');
                if (response.data.message) {
                  ksAlertService.success(response.data.message);
                }

                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                return response || $q.when(response);

            },
            responseError: function(response) {
                var data = response.data,
                    errorMessage,
                    ksAlertService = $injector.get('ksAlertService');


                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                // if (data) {

                //     errorMessage = data.statusCode + " : " + data.error;
                //     if (data.message) {
                //         errorMessage = errorMessage + "-" + data.message;
                //     }
                //     ksAlertService.error(errorMessage);
                // }

                 if (data.message) {
                  ksAlertService.error(response.data.message);
                }

                return $q.reject(response);
            }
        };
    }


}());