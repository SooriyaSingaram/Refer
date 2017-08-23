    /**
     * Bank Deposit Detail Controller
     */
    (function() {
        'use strict';
        angular
            .module('bankDeposit')
            .controller('bankDepositDetailController', BankDepositDetailController)
        BankDepositDetailController.$inject = ['commonService', 'dataService', '$state', 'ksAlertService', 'employees', 'franchiseBranches', 'outlets', '$filter'];

        /**
         * @memberof module:bankDeposit
         *
         * CRUD application is performed and also displays the data
         * @requires commonService
         * @requires dataService
         * @requires $state
         * @requires ksAlertService
         * @requires employees
         * @requires franchiseBranches
         * @requires outlets
         * @requires $filter
         * @ngInject
         */

        function BankDepositDetailController(commonService, dataService, $state, ksAlertService, employees, franchiseBranches, outlets, $filter) {
            var self = this,
                url = '/api/bankdeposit',
                receipt,
                data;

            self.depositDetails = {};
            self.disableSubmit = disableSubmit;
            self.beforeRender = beforeRender;
            self.reset = reset;
            self.checkDate = checkDate;
            self.formValidation = commonService.formValidation;
            self.addBankDepositDetails = addBankDepositDetails;

            // Initialize the all function,its load the entire page.
            function init() {
                getBankDepositDetailsById();
                getBankDepositDetails();
              self.branchDetails = outlets.concat(franchiseBranches);
            }

            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }
            /**
             * disable the  future dates
             * @param $dates
             */
            function beforeRender($dates) {
                for (var i = 0; i < $dates.length; i++) {
                    if (new Date().getTime() < $dates[i].utcDateValue) {
                        $dates[i].selectable = false;
                    }
                }
            }
            /**
             * Based on the State get the id and checks the Edit mode or not.
             * If its editmode,to passing the URL get the particular bank deposit detail.
             */
            function getBankDepositDetailsById() {
                self.isEditmode = commonService.isEditMode();

                if (self.isEditmode === true) {
                    commonService.getDataById(url).then(function(depositDetails) {
                        self.depositDetails = depositDetails;
                        console.log(  self.depositDetails );
                    });
                }
                else{
                         getBranchDetails();
                }
            }
            /**
             * Get the all bank deposit details using data service passing the URL.
             * On success call getting all bank deposit details 
             */
            function getBankDepositDetails() {
                return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    self.depositDetail = responseData;
                }
            }
            //On click function to change the status of the button
            function disableSubmit() {
                self.submitbut = false;
            }

            /**
             * Reset the data in the form
             * @param depositDetails
             */
            function reset(depositDetails) {
                depositDetails.depositDate = null;
                depositDetails.depositAmount = '';
                depositDetails.receipt = '';
            }
            /**
             * Compare the today and deposit date based on shows the reason field 
             * @param date
             * @param depositDate
             * @param branchId
             */
            function checkDate(date, depositDate, branchId) {
                var Isodate = depositDate.toISOString();
                var deposit = self.depositDetail.filter(function(deposit) {
                    return (deposit.branchId === branchId && deposit.depositDate === Isodate);
                });
                if (deposit.length == 0) {
                    var todayDate = $filter('date')(date, 'yyyy-MM-dd');
                    var depositDate = $filter('date')(depositDate, 'yyyy-MM-dd');
                    if (todayDate === depositDate) {
                        self.reason = false;
                    } else {
                        self.reason = true;
                    }
                } else {
                    self.depositDetails.depositDate = null;
                    ksAlertService.warn('Already deposit the amount');
                }

            }
            /**
             * Add the bank deposit details using data service passing the URL.
             * On success call getting all bank deposit details in a summary list.
             * @param depositDetails
             */
            function addBankDepositDetails(depositDetails) {
                self.depositDetails.receipt = receipt;

                if (self.depositDetails.receipt != undefined) {
                    dataService.saveData(url, depositDetails).then(successHandler, errorHandler); //passing the  POST URL to dataService ,its sucesss returns the data
                } else {
                    ksAlertService.warn('Please select the files');
                }

                function successHandler(responseData) {
                    $state.go('root.bankDeposit-list');
                }
            }
            /**
             * Get the login details and based on the branchId filter the details.
             * Branch value is assigned to form fields.
             */
            function getBranchDetails() {
                self.userDetail = commonService.getUserinfo();
          self.branchDetails = outlets.concat(franchiseBranches);
                var branch = self.branchDetails.filter(function(branch) {
                    return (branch.branchId === self.userDetail.branchId);
                });
                var date = new Date();
                date.setHours(0, 0, 0, 0);
                self.depositDetails.Date = date;
                self.depositDetails.branchId = self.userDetail.branchId;
                self.depositDetails.bankName = branch[0].bankName;
                self.depositDetails.bankAc = branch[0].bankAc;
                var franchiseDetails = {};
                if ((branch[0].outletType != undefined) && (branch[0].outletType.outletType === 'Franchise')) {
                    franchiseDetails.franchise = true;
                    franchiseDetails.franchiseId = branch[0].branchId;
                }
                if (branch[0].franchiseId != undefined) {
                    franchiseDetails.franchise = true;
                    franchiseDetails.franchiseId = branch[0].franchiseId;
                }
                self.depositDetails.franchise = franchiseDetails;
            }
            //Get the receipt based on the id
            document.getElementById('receipt').addEventListener("change", bankReceiptupload, false);

            /**
             * On event trigger function read the image file,
             *  store in array
             * @param event
             */
            function bankReceiptupload(event) {
                receipt = [];
                var files = event.target.files; //FileList object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        receipt.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }

            init();
        }
    }());
