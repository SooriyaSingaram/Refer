/**
 * Number Validation
 */
(function() {

    'use strict';

    angular
        .module('app.data')
        .directive("numbersOnly", NumbersOnly)
    /**
     * @memberof module:app.data 
     * 
     * directive to validate only numbers in input field.
     */
    function NumbersOnly() {
        return {
            require: 'ngModel',
            scope: {
                precision: '@'
            },
            link: function(scope, element, attrs, modelCtrl) {
                var currencyDigitPrecision = scope.precision;

                var currencyDigitLengthIsInvalid = function(inputValue) {
                    return countDecimalLength(inputValue) > currencyDigitPrecision;
                };

                var parseNumber = function(inputValue) {
                    if (!inputValue) return null;
                    inputValue.toString().match(/-?(\d+|\d+.\d+|.\d+)([eE][-+]?\d+)?/g).join('');
                    var precisionNumber = Math.round(inputValue.toString() * 100) % 100;

                    if (!!currencyDigitPrecision && currencyDigitLengthIsInvalid(inputValue)) {
                        inputValue = inputValue.toFixed(currencyDigitPrecision);
                        modelCtrl.$viewValue = inputValue;
                    }
                    return inputValue;
                };

                var countDecimalLength = function(number) {
                    var str = '' + number;
                    var index = str.indexOf('.');
                    if (index >= 0) {
                        return str.length - index - 1;
                    } else {
                        return 0;
                    }
                };

                element.on('keypress', function(evt) {
                    var charCode, isACommaEventKeycode, isADotEventKeycode, isANumberEventKeycode;
                    charCode = String.fromCharCode(evt.which || event.keyCode);
                    isANumberEventKeycode = '0123456789'.indexOf(charCode) !== -1;
                    isACommaEventKeycode = charCode === ',';
                    isADotEventKeycode = charCode === '.';

                    var forceRenderComponent = false;

                    if (modelCtrl.$viewValue != null && !!currencyDigitPrecision) {
                        forceRenderComponent = currencyDigitLengthIsInvalid(modelCtrl.$viewValue);
                    }

                    var isAnAcceptedCase = isANumberEventKeycode || isACommaEventKeycode || isADotEventKeycode;

                    if (!isAnAcceptedCase) {
                        evt.preventDefault();
                    }

                    if (forceRenderComponent) {
                        modelCtrl.$render(modelCtrl.$viewValue);
                    }

                    return isAnAcceptedCase;
                });

                modelCtrl.$render = function(inputValue) {
                    return element.val(parseNumber(inputValue));
                };

                modelCtrl.$parsers.push(function(inputValue) {

                    if (!inputValue) {
                        return inputValue;
                    }

                    var transformedInput;
                    modelCtrl.$setValidity('number', true);
                    transformedInput = parseNumber(inputValue);

                    if (transformedInput !== inputValue) {

                        modelCtrl.$viewValue = transformedInput;
                        modelCtrl.$commitViewValue();
                        modelCtrl.$render(transformedInput);
                    }
                    return transformedInput;
                });
            }
        };
    }

}());