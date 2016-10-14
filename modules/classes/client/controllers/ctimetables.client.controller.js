'use strict';

// Classes controller
angular.module('classes').controller('CtimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ctimetables',
  function ($scope, $stateParams, $location, Authentication, Ctimetables) {
    $scope.authentication = Authentication;
    $scope.props = function(o){
      return o.materia +' ('+ o.name +')';
    };
    // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    // set substitution
    $scope.sost = [{ materia:'', name:'sostituzione' },{ materia:'', name:'uscita anticipata' }]; 
    $scope.setsost = false;
    $scope.changeList = function(list){
      if($scope.setsost === false){
        return list ;
      }
      return $scope.sost;
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
