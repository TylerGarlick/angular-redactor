(function () {
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
    .directive('redactor', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

          var updateModel = function updateModel(value) {
            // $timeout to avoid $digest collision
              $timeout(function () {
                scope.$apply(function () {
                  ngModel.$setViewValue(value);
                });
              });
            },
            options = {
              changeCallback: updateModel
            },
            additionalOptions = attrs.redactor ?
              scope.$eval(attrs.redactor) : {},
            editor,
            $_element = angular.element(element);

          angular.extend(options, redactorOptions, additionalOptions);

          // put in timeout to avoid $digest collision.  call render() to
          // set the initial value.
          $timeout(function () {
            editor = $_element.redactor(options);
            ngModel.$render();
          });

          ngModel.$render = function () {
            if (angular.isDefined(editor)) {
              $timeout(function() {
                $_element.redactor('code.set', ngModel.$viewValue || '');
              });
            }
          };
        }
      };
    }]);
})();

