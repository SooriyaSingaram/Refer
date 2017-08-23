/**
 * Loader
 */
(function () {
    
    'use strict';
        
    angular
        .module('app.data')
        .directive("loader", KSPreLoader)

        /**
        * @memberof module:app.data 
        * 
        * directive to hide and show the preloader
        * 
        */
        function KSPreLoader () {
            return function ($scope,element,attrs) {
                $scope.$on("loader_show", function () {
                    element[0].style.display='block';
                });
                return $scope.$on("loader_hide", function () {
                   element[0].style.display='none';
                });
            };
        }

}());










