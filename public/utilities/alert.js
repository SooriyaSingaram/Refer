(function() {

    'use strict';

    angular.module('app.data')
        .service('ksAlertService', KSAlertService)

    KSAlertService.$inject = ['$uibModal', '$sce'];

    /**
     *  service for handling alerts. 
     *
     * @memberof module:app
     *
     * @requires $modal
     * @ngInject
     */
    function KSAlertService($modal, $sce) {
        var counter = 0,
            modalDefaults = {
                backdrop: 'static',
                keyboard: false,
                modalFade: true,
                templateUrl: 'app/modules/alert/alert.html'
            },

            modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                showCancelButton: false,
                actionButtonClass: 'btn-success',
                bodyText: 'Perform this action?'
            };

        /**
         * Display warning message to the user
         * @public
         *
         * @param {String} message - warning message to be displayed
         * @returns Promise
         */
        this.warn = function(message) {
            var options = {
                headerText: 'Warning',
                bodyText: message,
                styleName: 'modalWarning'
            };
            return this.show(null, options);
        }

        this.success = function(message) {
            var options = {
                headerText: 'Success',
                bodyText: message,
                styleName: 'modalWarning'
            };
            return this.show(null, options);
        }

        /**
         * Display error message to the user 
         * @public
         *
         * @param {String} message - error message to be displayed
         * @returns Promise
         */
        this.error = function(message) {

            var options = {
                headerText: 'Error',
                bodyText: message,
                styleName: 'modalError'
            };
            return this.show(null, options);
        }

        /**
         * 
         * Displays custom modal  
         * @public 
         *
         ** @param {String} templateURL - custom template file path
         * @param {Object} data - data required for the custom modal
         * @returns Promise
         */
        this.preview = function(templateURL, data) {
            var options = {
                    data: data
                },
                modalOptions = {
                    templateUrl: templateURL
                };
            return this.show(modalOptions, options);
        }

        /**
         * Displays confirmation dialog
         * @public
         *
         * @param {String} message - message to be displayed
         * @returns Promise
         */
        this.confirm = function(message) {
            var options = {
                actionButtonText: 'Yes',
                closeButtonText: 'No',
                showCancelButton: true,
                headerText: 'Confirm',
                bodyText: message
            };
            return this.show(null, options);
        }

        /**
         * Displays modal dialog
         * @public
         *
         * @param {Object} customModalDefaults - default properties of the modal
         * @param {Object} customModalOptions - UI options for the modal
         * @returns Promise
         */
        this.show = function(customModalDefaults, customModalOptions) {

            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {},
                tempModalOptions = {};

            if (counter == 0) {
                counter++;
            } else {
                return;
            }

            if (customModalOptions)
                tempModalDefaults["windowClass"] = "app-modal-window " + customModalOptions.styleName;
            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);
            tempModalOptions.bodyText = $sce.trustAsHtml(tempModalOptions.bodyText);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function(result) {
                        counter--;
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function(result) {
                        counter--;
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        }
    }
}());