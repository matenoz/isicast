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
        timetable:[]  
      });
      // create a empty timetable
      classe.timetable.push({ nome_ora:'08 - 09', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'09 - 10', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'10 - 11', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'11 - 12', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'12 - 13', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'13 - 14', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'14 - 15', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'15 - 16', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' });
	
      // Redirect after save
      classe.$save(function (response) {
        $location.path('classes/' + response._id);

        // Clear form fields
        $scope.nome_classe = '';
        $scope.indirizzo = '';
        $scope.docenti = '';
        $scope.coordinatore = '';
        $scope.timetable = [];
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

