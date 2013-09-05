'use strict';

/**
 * usage: <textarea ng-model="content" redactor></textarea>
 *
 *    additional options:
 *      options: hash (pass in a redactor options hash)
 *
 */
angular.module('angular-redactor', [])
  .directive("redactor", [function () {
    return {
      restrict: 'A',
      require: "ngModel",
      template: '<textarea cols="30" rows="10"></textarea>',
      link: function (scope, elm, attrs, ngModel) {
        scope.safeApply = function (fn) {
          var phase = this.$root.$$phase;
          if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        }

        var updateModel = function () {
          return scope.safeApply(function () {
            ngModel.$setViewValue(elm.redactor('get'));
          });
        };

        var options = {
          changeCallback: updateModel
        };

        var additionalOptions = attrs.options ? scope.$eval(attrs.options) : {};
        angular.extend(options, additionalOptions);

        var redactor = elm.redactor(options);
        ngModel.$render = function () {
          return redactor != null ? elm.redactor('set', ngModel.$viewValue || '') : void 0;
        };
      }
    };
  }]);