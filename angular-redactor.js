(function() {
    'use strict';

    /**
     * usage: <textarea ng-model="content" redactor></textarea>
     *
     *    additional options:
     *      redactor: hash (pass in a redactor options hash)
     *
     */

    var redactorOptions = {};

    angular.module('angular-redactor', [])
        .constant('redactorOptions', redactorOptions)
        .directive('redactor', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    redactor: "@",
                    updateOn: "@"
                },
                link: function(scope, element, attrs, ngModel) {

                    // by default, assume we want to update the model based on changeCallback
                    scope.updateOn = typeof scope.updateOn !== 'undefined' ? scope.updateOn : "changeCallback";

                    // Expose scope var with loaded state of Redactor
                    scope.redactorLoaded = false;

                    var updateModel = function updateModel(value) {
                            // $timeout to avoid $digest collision

                            var code = this.code.get();

                            $timeout(function() {
                                scope.$apply(function() {
                                    ngModel.$setViewValue(code);
                                });
                            });
                        },
                        options = {},
                        additionalOptions = attrs.redactor ?
                            scope.$eval(attrs.redactor) : {},
                        editor,
                        $_element = angular.element(element);

                    options[scope.updateOn] = updateModel;

                    angular.extend(options, redactorOptions, additionalOptions);

                    // prevent collision with the constant values on ChangeCallback
                    var updateCallback = additionalOptions[scope.updateOn] || redactorOptions[scope.updateOn];

                    if (updateCallback) {
                        options[updateCallback] = function(value) {
                            updateModel.call(this, value);
                            updateCallback.call(this, value);
                        }
                    }

                    // put in timeout to avoid $digest collision.  call render() to
                    // set the initial value.
                    $timeout(function() {
                        editor = $_element.redactor(options);
                        ngModel.$render();
                    });

                    ngModel.$render = function() {
                        if(angular.isDefined(editor)) {
                            $timeout(function() {
                                $_element.redactor('code.set', ngModel.$viewValue || '');
                                $_element.redactor('placeholder.toggle');
                                scope.redactorLoaded = true;
                            });
                        }
                    };
                }
            };
        }]);
})();

