'use strict';

// Classes controller
angular.module('classes').controller('CtimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ctimetables',
  function ($scope, $stateParams, $location, Authentication, Ctimetables) {
    $scope.authentication = Authentication;
  
    // Create new Classe
    // $scope.create = function (isValid) {
    //   $scope.error = null;

    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'classeForm');

    //     return false;
    //   }

    //   // Create new Classe object
    //   var classe = new Ctimetables({
    //     nome_classe: this.nome_classe,
    //     indirizzo: this.indirizzo,
    //     docenti:this.docenti,
    //     coordinatore:this.coordinatore,  
    //     timetable:[]  
    //   });

    //   // Redirect after save
    //   classe.$save(function (response) {
    //     $location.path('ctimetables/' + response._id);

    //     // Clear form fields
    //     $scope.nome_classe = '';
    //     $scope.indirizzo = '';
    //     $scope.docenti = [];
    //     $scope.coordinatore = '';
    //     $scope.timetable = [];
    //   }, function (errorResponse) {
    //     $scope.error = errorResponse.data.message;
    //   });
    // };

    // // Remove existing Classe
    // $scope.remove = function (classe) {
    //   if (classe) {
    //     classe.$remove();

    //     for (var i in $scope.classes) {
    //       if ($scope.classes[i] === classe) {
    //         $scope.classes.splice(i, 1);
    //       }
    //     }
    //   } else {
    //     $scope.classe.$remove(function () {
    //       $location.path('classes');
    //     });
    //   }
    // };

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
