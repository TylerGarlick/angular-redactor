'use strict';
angular.module('app', ['ngRoute', 'angular-redactor'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when("/", { templateUrl: "views/main.html", controller: "RedactorDemo"})
      .otherwise({ redirectTo: "/" });
  }]);

angular.module('app')
  .controller('RedactorDemo', ['$scope',
    function ($scope) {

      $scope.redactorOptions = {

      };

      $scope.changeContent = function () {
        $scope.content = "<h1>Some bogus content</h1>"
      }
      $scope.content = "<p>This is my fawesome content</p>";
    }]);