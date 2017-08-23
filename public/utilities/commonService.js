/**
 * Common Service
 */
(function() {
    'use strict';
    angular
        .module('app.data')
        .service('commonService', CommonService)

    CommonService.$inject = ['$http', '$q', '$filter', '$stateParams', 'dataService', '$anchorScroll', '$location', 'authService'];

    /**
     * @memberof module:app.data
     *
     * the service perform the common opreation
     * @requires $http
     * @requires $q
     * @requires $filter
     * @requires $stateParams
     * @requires dataService
     * @requires $anchorScroll
     * @requires authService
     * 
     * @ngInject
     */

    function CommonService($http, $q, $filter, $stateParams, dataService, $anchorScroll, $location, authService) {
        var self = this;

        self.getCountryCode = getCountryCode;
        self.getDataById = getDataById;
        self.isEditMode = isEditMode;
        self.paginationLimit = paginationLimit;
        self.isActiveLimit = isActiveLimit;
        self.setLimit = setLimit;
        self.isEmpty = isEmpty;
        self.formValidation = formValidation;
        self.getUserinfo = getUserinfo;
        self.allowNumber = allowNumber;
        self.print = print;
        self.downloadPdf = downloadPdf;
        self.getRolesDetails = getRolesDetails;

        //Checks the string is Empty or Not
        function isEmpty(k) {
            return !k.length;
        }

        /**
         *Get the state Id and return the value
         */
        function isEditMode() {
            var stateId = isEmpty($stateParams.id);
            var editMode = stateId ? false : true;
            return editMode;
        }
        //Get the stateparams Id and return the value
        function getDataById(url) {
            if ($stateParams.id != null) {
                return dataService.getDataById(url, $stateParams.id)
            }
        }

        //Get the Auhtenticated User Information
        function user() {
            var userInfo = authService.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({
                    authenticated: false
                });
            }
        }
        //Get the User Details at the time of Login
        function getUserinfo() {
            var userDetail = user().$$state.value;
            return userDetail;
        }
        /**
         * Validate the form and scroll to the required field
         * @param anchor
         */
        function formValidation(anchor) {
            if (anchor !== null && anchor !== undefined) {
                $location.hash(anchor);
                $anchorScroll(anchor);
                return false;
            } else {
                return true;
            }

        }
        //Get the All CountryCode Details
        function getCountryCode() {
            var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url: '/build/json/countrycodes.json'
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

        /**
         * Pagination
         * Initially set the available Limits and return the available limits
         */
        function paginationLimit() {
            self.availableLimit = [10,25,50,75,100];
            return self.availableLimit;
        }

        /**
         * Set the amount for a summary list in a page
         * @param amount
         */
        function setLimit(amount) {
            self.limit = amount;
            return self.limit;
        };

        /**
         * Initially Show amount for a summary list in a page
         * @param amount
         */
        function isActiveLimit(amount) {
            return amount === self.limit;
        };

        /**
         * on click function the event is trigger and its only allow poistive numbers
         * @param event
         */
        function allowNumber(event) {
            var keys = {
                'up': 38,
                'right': 39,
                'down': 40,
                'left': 37,
                'escape': 27,
                'backspace': 8,
                'tab': 9,
                'enter': 13,
                'del': 46,
                '0': 48,
                '1': 49,
                '2': 50,
                '3': 51,
                '4': 52,
                '5': 53,
                '6': 54,
                '7': 55,
                '8': 56,
                '9': 57
            };
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) continue;
                if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                    return; //default event
                }
            }
            event.preventDefault();
        }


        //Print the data in report
        function print(id) {
        var contents = document.getElementById(id).innerHTML;
            var frame1 = document.createElement('iframe');
            frame1.name = "frame1";
            frame1.style.position = "absolute";
            frame1.style.top = "-1000000px";
            document.body.appendChild(frame1);
            var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
            frameDoc.document.open();
            frameDoc.document.write('<html><head><link rel="stylesheet" type="text/css" href="build/bower/print.css" /></head><body>' + '<h1 class="head">Komalas</h1></body></html>');
            frameDoc.document.write('</head><body>');
            frameDoc.document.write(contents);
            frameDoc.document.write('</body></html>');
            frameDoc.document.close();
            setTimeout(function () {
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                document.body.removeChild(frame1);
            }, 500);
            return false;        }

        //Pdf the data in report
        function downloadPdf(heading) {
            var doc = new jsPDF('p', 'pt');
            var elem = document.getElementById("pdfgrid");
            var res = doc.autoTableHtmlToJson(elem);
            doc.text(heading, 40, 30);
            doc.autoTable(res.columns, res.data);
            doc.save("Komlas.pdf");
        }

        function getRolesDetails() {
                      var deferred = $q.defer(),
                options = {
                    method: 'GET',
                    cache: false,
                    url: '/utilities/role-access.json'
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