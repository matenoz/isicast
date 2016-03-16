'use strict';

// Classes controller
angular.module('classes').controller('CtimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ctimetables',
  function ($scope, $stateParams, $location, Authentication, Ctimetables) {
    $scope.authentication = Authentication;
    $scope.props = function(o){
      return o.materia +' ('+ o.name +')';
    };
    // Update existing Classe
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'classeForm');

        return false;
      }

      var classe = $scope.classe;

      classe.$update(function () {
        $location.path('ctimetables/' + classe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Classes
    $scope.find = function () {
      $scope.classes = Ctimetables.query();
    };

    // Find existing Classe
    $scope.findOne = function () {
      $scope.classe = Ctimetables.get({
        classeId: $stateParams.classeId
      });
    };
  }
]);
