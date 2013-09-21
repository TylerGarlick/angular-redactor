(function () {
  'use strict';

  /**
   * usage: <textarea ng-model="content" redactor></textarea>
   *
   *    additional options:
   *      options: hash (pass in a redactor options hash)
   *
   */
  angular.module('angular-redactor', [])
    .directive("redactor", ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, elm, attrs, ngModel) {
          var updateModel = function updateModel(value) {
              scope.$apply(function () {
                ngModel.$setViewValue(value);
              });
            }, options = {
              changeCallback: updateModel
            }, additionalOptions = angular.isDefined(attrs.options) ?
                                   scope.$eval(attrs.options) : {},
            editor;
          angular.extend(options, additionalOptions);

          $timeout(function () {
            editor = elm.redactor(options);
          });

          ngModel.$render = function () {
            if (angular.isDefined(editor)) {
              elm.redactor('set', ngModel.$viewValue || '')
            }
          };
        }
      };
    }]);
})();

