(function() {
    'use strict';
    angular.module('sales', ['app.data', 'ui.router'])
        .config(Config);

    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('root.sales-order', {
                url: '/sales-order',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/sales/view/sales-order.html'
                    }
                }

            })
            
            .state('root.view-sales-order', {
                url: '/view-sales-order',
                views: {
                    'content@': {
                        templateUrl: '/app/modules/sales/view/view-sales-order.html'
                        }
                    }
                

            })
    }

}());