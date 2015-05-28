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
                    redactor: '='
                },
                link: function(scope, element, attrs, ngModel) {

                    // Expose scope var with loaded state of Redactor
                    scope.redactorLoaded = false;

                    var updateModel = function updateModel(value) {
                            // $timeout to avoid $digest collision
                            $timeout(function() {
                                scope.$apply(function() {
                                    ngModel.$setViewValue(value);
                                });
                            });
                        },
                        options = {
                            changeCallback: updateModel
                        },
                        additionalOptions = scope.redactor ? scope.redactor : {},
                        editor,
                        $_element = angular.element(element);

                    angular.extend(options, redactorOptions, additionalOptions);

                    // prevent collision with the constant values on ChangeCallback
                    if(!angular.isUndefined(redactorOptions.changeCallback)) {
                        options.changeCallback = function() {
                            updateModel.call(this);
                            redactorOptions.changeCallback.call(this);
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
                                $_element.redactor('set', ngModel.$viewValue || '');
                                scope.redactorLoaded = true;
                            });
                        }
                    };
                    scope.$watch(function(){return scope.redactor}, function(newValue, oldValue){
                        angular.extend(options, newValue);
                        $timeout(function() {
                            editor.redactor('core.destroy');
                            editor = $_element.redactor(options);
                            ngModel.$render();
                        });
                    });
                }
            };
        }]);
})();

