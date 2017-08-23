/**
 * Configuration Controller
 */
(function() {

    'use strict';

    angular
        .module('configuration')
        .controller('configurationController', ConfigurationController)

    ConfigurationController.$inject = ['commonService', 'dataService', '$filter', 'ksAlertService', 'configSetting'];
    /**
     * @memberof module:configuration
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires configSetting
     * @ngInject
     */
    function ConfigurationController(commonService, dataService, $filter, ksAlertService, configSetting) {

        var self = this,
            url = '/api/configuration',
            originalData,
            configDetail;
        //Create,Update Configuration Details
        self.addDetails = addDetails;
        self.updateData = updateData;
        //Set and Reset functions in form page
        self.setConfigType = setConfigType;
        self.removeData = removeData;
        self.category = null;
        self.reset = reset;
        self.configData;
        // Setting the maximum number of pages in summary list
        self.setValue = setValue;
        self.isActiveValue = isActiveValue;

        // Initialize the all function,its load the entire page.
        function init() {
            getDetails();
            self.availableLimits = commonService.paginationLimit();
        }
        /**
         * Set the count for a summary page.
         * @param count
         */
        function setValue(count) {
            commonService.setLimit(count);
        }
        /**
         * Initially show count for a summary page.
         * @param count
         */
        function isActiveValue(count) {
            commonService.isActiveLimit(count);
        }
        /**
         * Get the all configuration details using data service passing the URL.
         * On success call getting all configuration details in a summary list.
         */
        function getDetails() {
            dataService.getData(url).then(successHandler); //passing the GET URL into dataService,while its sucesss will returns the data

            function successHandler(responseData) {
                if (responseData && responseData.length > 0) {
                    configDetail = responseData[0];
                } else {
                    configDetail = {};
                    configDetail[configSetting.configType] = [];
                }
                originalData = configDetail[configSetting.configType];
                setConfigType();
            }
        }
        /**
         * Based on the Id,delete the data from the configuration.
         * if configuration present in the menu cannot be deleted and displays the warning messages.
         * @param index
         */
        function removeData(index,data) {
           
            ksAlertService.confirm("Are you sure you want to delete this ?").then(function() {
                data.isActive=false;
                configDetail[configSetting.configType] = self[configSetting.configType];
                console.log(configDetail[configSetting.configType]);
                dataService.updateData(url,configDetail._id, configDetail).then(successHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data
            });
        }
        // To set configuration details in form pages
        function setConfigType() {
            self[configSetting.configType] = angular.copy(originalData);
        }
        /**
         * Get the configuration details based on Id for setting count value,
         * for particular data.
         * @param modelKey
         * @param count
         */
        function getModelId(modelKey, count) {
            var suffix = "000";
            suffix = suffix.substring(0, suffix.length - count.toString().length) + count;
            return modelKey.concat(suffix);
        }
        /**
         * Add the configuration details using data service passing the URL.
         * Its first validate the configuration details and allow to add data.
         * On success call getting all configuration details in a summary list.
         * @param configData
         */
        function addDetails(configData) {
            if (!isValidConfigDetails(configData))
                return false;

            configData.editMode = false;
            if (configData._id) {
                configDetail[configSetting.configType] = self[configSetting.configType];
            } else {
                configData[configSetting.configProperties[0]] = getModelId(configSetting.configModelKey, (self[configSetting.configType].length + 1))
                configDetail[configSetting.configType].push(configData);
            }

            if (configDetail._id) {
                dataService.updateData(url, configDetail._id, configDetail).then(successHandler); //passing the UPDATE URL into dataService,while its sucesss will returns the data
            } else {
                dataService.saveData(url, configDetail).then(successHandler); //passing the POST URL into dataService,while its sucesss will returns the data
            }

        }

        function successHandler(responseData) {
            getDetails();
            self.reset();
        }
        /**
         * By getting all configuration details in form page while adding or updating,
         * which it gets the existing data and shows warning alert message. 
         * @param configData
         */
        function isValidConfigDetails(configData) {
            var configDataCollection = configDetail[configSetting.configType],
                filteredCollection;

            for (var i = 0; i < configSetting.configProperties.length; i++) {
                var property = configSetting.configProperties[i];
                for (var j = 0; j < configDataCollection.length; j++) {
                    if (configData._id) {
                        if (configData._id != configDataCollection[j]['_id'] && configDataCollection[j][property] === configData[property]) {
                            ksAlertService.warn(property + " already exists");
                            return false;
                        }
                    } else {
                        if (configDataCollection[j][property] === configData[property]) {
                            ksAlertService.warn(property + " already exists");
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        /**
         * Update the configuration details using data service passing the URL.
         * Its first validate the configuration details and allow to update data.
         * On success call getting all configuration details in a summary list.
         * @param configData
         */
        function updateData(configData) {
            if (!isValidConfigDetails(configData))
                return false;
            configDetail[configSetting.configType] = self[configSetting.configType]
        }
        // Reseting the input field in a form.
        function reset() {
            self.configData = null;
        }

        init();
    }
}());