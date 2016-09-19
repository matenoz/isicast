'use strict';

// Replacements controller
angular.module('replacements').controller('ReplacementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Replacements',
  function ($scope, $stateParams, $location, Authentication, Replacements) {
    $scope.authentication = Authentication;
    $scope.classarray = ['I AFM','II AFM','III AFM','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','I SC','II SC','III SC','IV SC','V SC','I MAT','II MAT','III MAT','IV MAT','V MAT','II periodo SSS','III periodo SSS'];  
    $scope.hoursarray = ['08 - 09','09 - 10','10 - 11','11 - 12','12 - 13','13 - 14','14 - 15','15 - 16'];
    $scope.dailyreps = [];
    $scope.addRep = function(){
      $scope.dailyreps.push({ hour:$scope.rep.hour, classe:$scope.rep.classe, absent:$scope.rep.absent, substitute:$scope.rep.substitute }); 	
      $scope.alerts.push({ msg:'Sostituzione inserita correttamente. Clicca Update per aggiornare o inserisci altra sostituzione' });	
    };
    $scope.removeRep = function(index){
      $scope.dailyreps.splice(index, 1);
    };
      
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    // check if object exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    // Create new Replacement
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'replacementForm');

        return false;
      }

      // Create new Replacement object
      var replacement = new Replacements.r({
        rep_date: this.rep_date,
        daily_reps: []
      });

      angular.forEach($scope.dailyreps,function(rep,index){
        replacement.daily_reps.push({ hour:rep.hour, classe:rep.classe, absent:rep.absent, substitute:rep.substitute });
      });	
	
      // Redirect after save
      replacement.$save(function (response) {
        $location.path('replacements/' + response._id);

        // Clear form fields
        $scope.rep_date = '';
        $scope.daily_reps = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Replacement
    $scope.remove = function (replacement) {
      if (replacement) {
        replacement.$remove();

        for (var i in $scope.replacements) {
          if ($scope.replacements[i] === replacement) {
            $scope.replacements.splice(i, 1);
          }
        }
      } else {
        $scope.replacement.$remove(function () {
          $location.path('replacements');
        });
      }
    };

    // Update existing Replacement
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'replacementForm');

        return false;
      }

      var replacement = $scope.replacement;
      angular.forEach($scope.dailyreps,function(rep,index){
        replacement.daily_reps.push({ hour:rep.hour, classe:rep.classe, absent:rep.absent, substitute:rep.substitute });
      });	
      angular.forEach(replacement.daily_reps,function(rep,index){
        if(rep.isActive === false){
          replacement.daily_reps.splice(index, 1);
        }
      });
	
      replacement.$update(function () {
        $location.path('replacements/' + replacement._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Replacements
    $scope.find = function () {
      $scope.replacements = Replacements.r.query();
    };

    // Find a list of Teachers
    $scope.findt = function(){
      $scope.teachers = Replacements.t.query();
    };  
      
    // Find existing Replacement
    $scope.findOne = function () {
      $scope.replacement = Replacements.r.get({
        replacementId: $stateParams.replacementId
      });
    };
  }
]);
