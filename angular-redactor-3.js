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
            function _get(obj, path, defaultValue, justExistence) {
              if (!path) return undefined;
              var tree = path.split(/(?:\[|\]|\]?\.)/i).filter(i => i !== "");
              let fullDepth = obj || {};
              while (tree.length) {
                const currentDepth = tree.shift();
                if (fullDepth[currentDepth]) {
                  fullDepth = fullDepth[currentDepth];
                } else {
                  tree.splice(0);
                  return defaultValue;
                }
              }
              if (justExistence) {
                return typeof fullDepth !== "undefined" && fullDepth !== null;
              }
              return fullDepth;
            }
          
            function _hasIn(obj, path) {
              return _get(obj, path, undefined, true);
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
                }
                // $timeout to avoid $digest collision
                debounce = $timeout(function() {
                  if (_hasIn(ngModel, '$setViewValue')) {
                    try {
                      ngModel.$setViewValue(value);
                    } catch(e) {}
                  }
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
