'use strict';

// Classes controller
angular.module('classes').controller('ClassesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Classes',
  function ($scope, $stateParams, $location, Authentication, Classes) {
    $scope.authentication = Authentication;
  
    // Create new Classe
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'classeForm');

        return false;
      }

      // Create new Classe object
      var classe = new Classes({
        nome_classe: this.nome_classe,
        indirizzo: this.indirizzo,
        docenti:this.docenti,
        coordinatore:this.coordinatore,  
        orario_classe:this.orario_classe  
      });

      // Redirect after save
      classe.$save(function (response) {
        $location.path('classes/' + response._id);

        // Clear form fields
        $scope.nome_classe = '';
        $scope.indirizzo = '';
        $scope.docenti = '';
        $scope.coordinatore = '';
        $scope.orario_classe = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Classe
    $scope.remove = function (classe) {
      if (classe) {
        classe.$remove();

        for (var i in $scope.classes) {
          if ($scope.classes[i] === classe) {
            $scope.classes.splice(i, 1);
          }
        }
      } else {
        $scope.classe.$remove(function () {
          $location.path('classes');
        });
      }
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
        $location.path('classes/' + classe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Classes
    $scope.find = function () {
      $scope.classes = Classes.query();
    };

    // Find existing Classe
    $scope.findOne = function () {
      $scope.classe = Classes.get({
        classeId: $stateParams.classeId
      });
    };
  }
]);

