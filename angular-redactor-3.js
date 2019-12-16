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

  angular
    .module('angular-redactor', [])
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
            var castFunction = function (fn, defaultOutput) {
              return Object.prototype.toString.call(fn) === '[object Function]'
              ? fn
              : function() {}
            }

            var randomId =
                'redactor-' +
                Math.floor((1 + Math.random()) * 2e13)
                  .toString(16)
                  .substr(1) +
                +new Date(),
              debounce;

            element.attr('id', randomId);

            // Expose scope var with loaded state of Redactor
            scope.redactorLoaded = false;

            var updateModel = function updateModel(value) {
                if (debounce) {
                  $timeout.cancel(debounce);
                  debounce = undefined;
                }
                // $timeout to avoid $digest collision
                debounce = $timeout(function() {
                  castFunction((ngModel || {}).$setViewValue)(value);
                  debounce = undefined;
                }, 250);
              };

            var options = {
                spellcheck: false,
                callbacks: {
                  changed: updateModel
                }
              },
              additionalOptions = attrs.redactor
                ? scope.$eval(attrs.redactor)
                : {},
              editor;

            angular.extend(options, redactorOptions, additionalOptions);

            // put in timeout to avoid $digest collision.  call render()
            // to set the initial value.
            $timeout(function() {
              editor = $R('#' + randomId, options);
              ngModel.$render();
            });

            ngModel.$render = function() {
              if (angular.isDefined(editor)) {
                $timeout(function() {
                  editor.source.setCode(ngModel.$viewValue || '');
                  scope.redactorLoaded = true;
                });
              }
            };

            scope.$on('$destroy', function() {
              $R('#' + randomId, 'destroy');
            });
          }
        };
      }
    ]);
})();
