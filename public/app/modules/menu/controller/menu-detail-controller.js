/**
 * menu-detail-controller
 */
(function() {
    'use strict';
    angular
        .module('menu')
        .controller('menuDetailController', MenuDetailController)
    MenuDetailController.$inject = ['commonService', 'dataService', '$filter', '$state', 'menucategory', 'outlets', 'products', 'units', 'ksAlertService', 'auth','labourcosts','overheadprice']
    /**
     * @memberof module:menu
     *
     * CRUD application is performed and also displays the data
     * @requires commonService
     * @requires auth
     * @requires dataService
     * @requires $filter
     * @requires ksAlertService
     * @requires menucategory
     * @requires outlets
     * @requires products
     * @requires units
     * @ngInject 
     */
    function MenuDetailController(commonService, dataService, $filter, $state, menucategory, outlets, products, units, ksAlertService, auth,labourcosts,overheadprice) {
        var self = this,
            url = '/api/menus',
            data,
            userId,
            photo, photoCopy;
        self.menu = {};
        self.addIngredient = addIngredient;
        self.removeIngredient = removeIngredient;
        self.menuImageupload = menuImageupload;
        self.disablesubmit = disablesubmit;
        self.formValidation = commonService.formValidation;
        self.getProductAveragePrice = getProductAveragePrice;
        self.getProduct = getProduct;
        self.calculateCostPrice = calculateCostPrice;
        self.updateUnitsForIngredient = updateUnitsForIngredient;
        self.getMenuDetails = getMenuDetails;
        self.addMenu = addMenu;
        self.updateMenu = updateMenu;
        self.reset = reset;
        self.calculateIngredientPrice = calculateIngredientPrice;
        self.validateIngredientName = validateIngredientName;
        self.onlyNumbers = commonService.allowNumber;
        self.costpricecalculation = costpricecalculation;
        self.validatingprice = validatingprice;
        self.downloadPDF=downloadPDF;
        /**
         * Initialize the all function,its load the entire page
         */
        function init() {
            getMenuDetails();
            self.menucategory = menucategory;
            self.outlets = outlets;
            self.products = products;
            self.units = units;
            self.auth = auth;
            self.labourcosts = labourcosts;
            self.overheadprice = overheadprice;
        }
    function downloadPDF(pdf) {
      console.log(pdf);

    var dlnk = document.getElementById('dwnldLnk');
    dlnk.href = pdf;

    dlnk.click();


    alert('toma');
}
        /**
         * While passing the object data it validate the empty object or not and,
         * returns the value.
         * @param obj
         */
        function isEmptyobj(obj) {
            for (var x in obj) {
                return false;
            }
            return true;
        }
        /**
         * To set the details in edit mode
         * @param menu
         */
        function setData(menu) {
            data = menu;
            self.menu = angular.copy(data);
            photoCopy = self.menu.photos;

            if (isEmptyobj(data)) {
                checkIngredientDetails();
            }
        }
        /**
         * Reset the values in the summary list
         * @param menu
         */
        function reset() {
            setData(data);
        }
        /**
         * Get the all menu details using data service passing the URL.
         * On success call getting all menu details in a summary list
         */
        function getMenuDetails() {
            self.isEditmode = commonService.isEditMode();
            if (self.isEditmode) {
                commonService.getDataById(url).then(function(menu) {
                    for (var j = 0; j < menu.ingredients.length; j++) {
                        var product = getProduct(self.products, menu.ingredients[j]);
                        var ingredient = menu.ingredients[j];
                        ingredient.units = [];
                        var defaultUnit = {};
                        defaultUnit["unitId"] = product.unitId;
                        defaultUnit["unitName"] = product.unitdetails.unitName;
                        ingredient.units.push(defaultUnit);
                        for (var i = 0; i < product.unitConversion.length; i++) {
                            var toUnit = product.unitConversion[i].toUnit;
                            for (var c = 0; c < self.unitdetails; c++) {
                                if (toUnit === self.unitdetails[c].unitId) {
                                    var obj = {};
                                    obj["unitId"] = toUnit;
                                    obj["unitName"] = self.unitdetails[c].unitName;
                                    ingredient.units.push(obj);
                                }
                            }
                        }
                        ingredient = menu.ingredients[j];
                    }
                    setData(menu);
                });
            } else {
                setData({});
                checkIngredientDetails();
            }
        }
        /**
         * menuImageupload function is used read the file push into the photo array
         * @params event
         */
        document.getElementById('image').addEventListener('change', menuImageupload, false);

        function menuImageupload(event) {
            self.isEditmode = commonService.isEditMode();
            photo = [];
            if (self.isEditmode) {
                for (var i = 0; i < photoCopy.length; i++) {
                    photo.push(photoCopy[i]);
                }
            }

            var files = event.target.files; //FileList object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function(e) {
                    photo.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
        //Check the Menu ingredient based on create the ingredient details array
        function checkIngredientDetails() {
            if (self.menu && !self.menu.ingredient) {
                self.menu.ingredients = [];
                self.addIngredient(self.menu.ingredients);
            }
        }
        /**
         * Add the ingredients ng-model values into the ingredients array.
         * @params ingredients
         */
        function addIngredient(ingredients) {
            ingredients.push({
                unitId: '',
                qty: '',
                productName: '',
                price: '',
                productId: ''
            });
        }
        /**
         * removing ingredients.length when the removeIngredient function triggered
         * @params ingredients
         * @params index
         */
        function removeIngredient(ingredients, index) {
            if (ingredients.length === 1) {
                ksAlertService.warn('Please select at least one item');
            } else {
                ingredients.splice(index, 1);
                calculateCostPrice();
            }
        }
        // On click disablesubmit function which changes into enable field.
        function disablesubmit() {
            this.submitbut = false;
        }
        /**
         * Handles the error while getting false function
         */
        function errorHandler(e) {
            console.log(e.toString());
        }
        /**
         * Update the menu details using data service passing the URL.
         * Its first validate the menu details and allow to update data.
         * On success call getting all menu details in a summary list.
         * @param menu
         */
        function updateMenu(menu) {
            photoCopy
            menu.createdby = auth.employeeId;
            menu.photos = photo;
            menu.createdby = userId;
            dataService.updateData(url, menu._id, menu).then(successHandler, errorHandler);
        }
        /**
         * Add the menu details using data service passing the URL.
         * Its first validate the menu details and allow to add data.
         * On success call getting all menu details in a summary list.
         * @param menu
         */
        function addMenu(menu) {
            menu.createdby = auth.employeeId;
            menu.createdby = auth.employeeName;
            menu.photos = photo;
            dataService.saveData(url, menu).then(successHandler, errorHandler);
        }

        function successHandler(responseData) {
            $state.go('root.menu-list');
        }
        //Get the detail of the selected ingredient
        function getProduct(product, ingredient) {
            var products = $filter('filter')(product, {
                productId: ingredient.productId
            });
            return products[0];
        }
        //Get the information about Ingredients
        function updateUnitsForIngredient(ingredient) {
            if (ingredient.productId === undefined) {
                ingredient.qty = '';
                ingredient.price = '';
                ingredient.unitId = '';
            }
            var productUnit = {},
                product = getProduct(self.products, ingredient);
            if (product) {
                ingredient.productName = product.productName;
                ingredient.units = [];
                ingredient.qty = '';
                ingredient.price = '';
                productUnit.unitId = product.unitId;
                productUnit.unitName = product.unitdetails.unitName;
                ingredient.units.push(productUnit);
                for (var i = 0; i < product.unitConversion.length; i++) {
                    var toUnit = product.unitConversion[i].toUnit;
                    for (var c = 0; c < self.unitdetails; c++) {
                        if (toUnit === self.unitdetails[c].unitId) {
                            var obj = {};
                            obj["unitId"] = toUnit;
                            obj["unitName"] = self.unitdetails[c].unitName;
                            ingredient.units.push(obj);
                        }
                    }
                }
            }
            validateIngredientName(ingredient);
        }
        /**
         * get all the menuingredient and it will sum the quantity by using the calculateIngredientPrice
         */
        function calculateCostPrice() {
            var total = 0;
            angular.forEach(self.menu.ingredients, function(ingredient) {
                total += ingredient.price
            })
            //    if (isNaN(total)) total = 0;
            //costpricecalculation(parseFloat(total));
            self.price = parseFloat(total);

        }
        function costpricecalculation(value,details,obj){
            if((obj === undefined)||(details === undefined)){
              ksAlertService.warn('Please select labour cost and over head price');
              self.menu.avgTime = "";
            }
            self.labourdetail = labourcosts.filter(function(labour) {
                return (labour.labourCostId == obj);
            });
            self.overhead = overheadprice.filter(function(overhead) {
                return (overhead.overHeadPriceId == details);
            });

            var totalcost = self.price+self.labourdetail[0].totalLabourCost + self.overhead[0].totaloverheadPrice;
               self.menu.costPrice = totalcost * value;   

        }
        function validatingprice(outletPrice){
            if(self.menu.costPrice >= outletPrice ){
              ksAlertService.warn('Price should be greater then costprice');
           }
        }
        /**
         * By getting all selectedIngredient details in form page while adding or updating,
         * selectedIngredient data validate the existing data and shows warning alert message. 
         * @param selectedIngredient
         */
        function validateIngredientName(selectedIngredient) {
            var count = 0;
            angular.forEach(self.menu.ingredients, function(ingredient) {
                if (ingredient.productId === selectedIngredient.productId) {
                    count++;
                }
            });
            if (count >= 2) {
                ksAlertService.warn('Ingredient already exists');
                selectedIngredient.productId = "";
            }
        }
        /**
         * setting the average price for product by using getProductAveragePrice
         * @param product
         */
        function getProductAveragePrice(product) {
            return product.outletPrice
        }
        /**
         * By getting all ingredient details in form page while adding or updating,
         * Ingredeint data validate the existing data and Calculation. 
         * @param ingredient
         */
        function calculateIngredientPrice(ingredient) {
            console.log(ingredient);
            var convertedUnitRatio = 0,
                productAvgPrice,
                product = getProduct(self.products, ingredient);
            ingredient.price = 0;
            if (product && product.unitConversion && product.unitConversion.length > 0) {
                for (var j = 0; j < product.unitConversion.length; j++) {
                    if (product.unitConversion[j].toUnit === ingredient.unitId) {
                        convertedUnitRatio = product.unitConversion[j].from / product.unitConversion[j].to;
                        break;
                    } else if (product.unitId === ingredient.unitId) {
                        convertedUnitRatio = 1;
                        break;
                    }
                }
                productAvgPrice = getProductAveragePrice(product);
                ingredient.price = productAvgPrice * convertedUnitRatio * ingredient.qty;
            } else {
                var checkunit = commonService.isEmpty(ingredient.unitId);
                if (!checkunit) {
                     if(ingredient.qty){
                    self.menu.avgTime = "";
                }
                    productAvgPrice = getProductAveragePrice(product);
                    ingredient.price = productAvgPrice * ingredient.qty;
                }

            }
            calculateCostPrice();
        }
        init();
    }
}());