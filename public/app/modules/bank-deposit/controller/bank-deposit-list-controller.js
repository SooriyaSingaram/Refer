    /**
     *  Bank Deposit Controller
     */
    (function() {
        'use strict';
        angular
            .module('bankDeposit')
            .controller('bankDepositListController', BankDepositListController)
        BankDepositListController.$inject = ['dataService', 'commonService', '$filter', '$state', 'ksAlertService', 'outlets', 'franchiseBranches', '$scope', 'auth'];

        /**
         * @memberof module:outlet
         *
         * CRUD application is performed and also displays the data
         * @requires dataService
         * @requires commonService
         * @requires $filter
         * @requires $state
         * @requires ksAlertService
         * @requires outlets
         * @requires franchiseBranches
         * @requires $scope
         * @requires auth
         * @ngInject
         */
        function BankDepositListController(dataService, commonService, $filter, $state, ksAlertService, outlets, franchiseBranches, $scope, auth) {
            var self = this,
                data,
                url = '/api/bankdeposit';

            self.setValue = setValue;
            self.isActiveValue = isActiveValue;
            self.onlyNumbers = commonService.allowNumber;
            self.deleteDepositDetails = deleteDepositDetails;
            self.getUtcDate = getUtcDate;
            self.getBankDepositDetails = getBankDepositDetails;
            self.reset = reset;
            self.endDateBeforeRender = endDateBeforeRender;
            self.startDateBeforeRender = startDateBeforeRender;
            self.startDateOnSetTime = startDateOnSetTime;
            self.endDateOnSetTime = endDateOnSetTime;
            self.getdates = getdates;
            self.print = commonService.print;
            self.downloadPdf = commonService.downloadPdf;
            self.changeView = changeView;
            self.authorization = authorization;

            /**
             * Filed chooser
             * Based on the this filed chooser show and hide the column in a list.
             */
            self.fChooser_bankDeposit = {
                'deposit_Date': true,
                'bank_Name': true
            };
            // Initialize the all function,its load the entire page.
            function init() {
                getBankDepositDetails();
                self.availableLimits = commonService.paginationLimit();
                self.branchDetails = outlets.concat(franchiseBranches);
                self.franchiseInformation = getFranchiseDetails();
                authorization();
            }
            /**
             * Set the count for a summary list in a page
             * @param count
             */
            function setValue(count) {
                commonService.setLimit(count);
            }

            /**
             * Initially Show count for a summary list in a page
             * @param count
             */
            function isActiveValue(count) {
                commonService.isActiveLimit(count);
            }
            /**
             * Get the deposit date change into ISO format
             * @param date
             */
            function getUtcDate(date) {
                self.depositDate = date.toISOString();
            }

            // Handles the error while getting false function
            function errorHandler(e) {
                console.log(e.toString());
            }
            //Get the franchise Details
            function getFranchiseDetails() {
                var details;

                if ((auth.role === 'KS_RS006') || (auth.role === 'KS_RS008')) {
                    details = outlets.filter(function(outlet) {
                        return (outlet.outletType.outletType === 'Franchise');
                    });
                    return details.concat(franchiseBranches);
                }
                if (auth.role === 'KS_RS009') {
                    var franchiseBranchDetails = franchiseBranches.filter(function(franchiseBranch) {
                        return (franchiseBranch.branchId === auth.branchId);
                    });
                    details = outlets.filter(function(outlet) {
                        return (outlet.branchId === auth.branchId);
                    });
                    return details.concat(franchiseBranchDetails);
                }
            }
            /**
             * Get the all Bank deposit details using data service passing the URL.
             * On success call getting all Bank deposit details 
             */
            function getBankDepositDetails() {
                self.role = auth.role;
                    self.depositInfo = {};
                if ((auth.role === "KS_RS001") || (auth.role === "KS_RS002")|| (auth.role === "KS_RS003")) {
                    self.depositInfo.branchId = null;
                } else {
                    console.log(auth.branchId);
                    self.depositInfo.branchId = auth.branchId;
                }
                return dataService.getData(url).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    if ((auth.role === "KS_RS001") || (auth.role === "KS_RS002")|| (auth.role === "KS_RS003")) {
                        self.depositDetails = getBranchName(responseData);
                        data = angular.copy(getBranchName(responseData));
                    } else if (auth.role === "KS_RS006") {
                        var depositDetails = responseData.filter(function(depositDetail) {
                            return (depositDetail.franchise === true);
                        });
                        self.depositDetails = getBranchName(depositDetails);
                    } else {
                        var depositDetails = responseData.filter(function(depositDetail) {
                            return (depositDetail.branchId === auth.branchId);
                        });
                        self.depositDetails = getBranchName(depositDetails);
                        data = angular.copy(getBranchName(depositDetails));
                    }
                }
            }

            /**
             * Get branchName details
             * @param depositDetails
             */
            function getBranchName(depositDetails) {
                self.branchDetails = outlets.concat(franchiseBranches);
                angular.forEach(depositDetails, function(depositDetail) {
                    var branchData = self.branchDetails.filter(function(branchDetail) {
                        return (depositDetail.branchId === branchDetail.branchId);
                    });
                    depositDetail.branchName = branchData[0].branchName;
                })
                return depositDetails;
            }

            /**
             * Based on parameter filter the bank deposit details
             * @param depositDetails
             */
            function getdates(depositDetails) {
console.log(depositDetails);
                var url = "/api/bankDepositFilter";
                return dataService.getDataFilterBy(url, depositDetails).then(successHandler, errorHandler); //passing the GET URL to dataService ,its sucesss returns the data
                function successHandler(responseData) {
                    if ((auth.role === "KS_RS001") || (auth.role === "KS_RS002")|| (auth.role === "KS_RS003")) {
                        self.depositDetails = getBranchName(responseData);
                    } else if (auth.role === "KS_RS006") {
                        var depositDetails = responseData.filter(function(depositDetail) {
                            return (depositDetail.franchise.franchise === true);
                        });
                        self.depositDetails = getBranchName(depositDetails);
                    } else if (auth.role === "KS_RS008") {
                        var depositDetails = responseData.filter(function(depositDetail) {
                            return (depositDetail.franchise.franchise === true);
                        });
                        self.depositDetails = getBranchName(depositDetails);
                    } else {
                        var depositDetails = responseData.filter(function(depositDetail) {
                            return (depositDetail.branchId === auth.branchId);
                        });
                        self.depositDetails = getBranchName(depositDetails);
                    }
                }
            }
            /**
             * Based on the id update the delete status from the bank deposit details
             * @param id
             */
            function deleteDepositDetails(id) {
                ksAlertService.confirm("Are You Sure You Want To Delete This ?").then(function() {
                    dataService.updateData(url, id, {
                        isActive: false
                    }).then(successHandler, errorHandler); //passing the Update URL to dataService ,its sucesss returns the data
                });

                function successHandler(responseData) {
                    ksAlertService.warn('Deleted Successfully');
                    init();
                }
            }
            //Reset the form data
            function reset() {
                self.depositDetails = data;
                if ((auth.role === 'KS_RS001') || (auth.role === 'KS_RS002') || (auth.role === 'KS_RS006')||(auth.role === 'KS_RS003')) {
                    self.depositInfo = null;

                } else {
                         self.depositInfo.fromDate = null;
                         self.depositInfo.toDate = null;
                }

            }

            //broadcast the message when start will be changed
            function startDateOnSetTime() {
                $scope.$broadcast('start-date-changed');
            }
            //broadcast the message when end will be changed
            function endDateOnSetTime() {
                $scope.$broadcast('end-date-changed');
            }

            /**
             * To date before render  call this function
             * @param toDate
             * @param $dates
             */
            function startDateBeforeRender(toDate, $dates) {
                if (toDate) {
                    var activeDate = moment(toDate);
                    $dates.filter(function(date) {
                        return date.localDateValue() >= activeDate.valueOf()
                    }).forEach(function(date) {
                        date.selectable = false;
                    })
                }
            }
            /**
             *From  date before render  call this function
             * @param fromDate
             * @param $view
             * @param $dates
             */
            function endDateBeforeRender(fromDate, $view, $dates) {
                if (fromDate) {
                    var activeDate = moment(fromDate).subtract(1, $view).add(1, 'minute');

                    $dates.filter(function(date) {
                        return date.localDateValue() <= activeDate.valueOf()
                    }).forEach(function(date) {
                        date.selectable = false;
                    })
                }
            }

            /**
             *Based on the from and to date disable the dates
             * @param viewName
             * @param dateObject
             * @param $event
             */
            function changeView(viewName, dateObject, event) {
                if (event) {
                    event.stopPropagation()
                    event.preventDefault()
                }

                if (viewName && (dateObject.utcDateValue > -Infinity) && dateObject.selectable && viewToModelFactory[viewName]) {
                    var result = viewToModelFactory[viewName](dateObject.utcDateValue)

                    var weekDates = []
                    if (result.weeks) {
                        for (var i = 0; i < result.weeks.length; i += 1) {
                            var week = result.weeks[i]
                            for (var j = 0; j < week.dates.length; j += 1) {
                                var weekDate = week.dates[j]
                                weekDates.push(weekDate)
                            }
                        }
                    }

                    $scope.beforeRender({
                        $view: result.currentView,
                        $dates: result.dates || weekDates,
                        $leftDate: result.leftDate,
                        $upDate: result.previousViewDate,
                        $rightDate: result.rightDate
                    })

                    $scope.data = result
                }
            }
            //To check the role is authorized or not
            function authorization() {
                var role = auth.role;
                var rolesDetails = commonService.getRolesDetails().then(function(predefinedRoles) {
                        var predefinedRoles = predefinedRoles;
                        var accessRoles = predefinedRoles.filter(function(accessRoles) {
                            return accessRoles.role === role;
                        })[0];
                        self.authorizeData = accessRoles.access;
                    },
                    function(data) {
                        console.log('JSON retrieval failed.')
                    });;
            }

            init();
        }
    }());