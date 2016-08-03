'use strict';

// Adoptions controller
angular.module('adoptions').controller('AdoptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Adoptions',
  function ($scope, $stateParams, $location, Authentication, Adoptions) {
    $scope.authentication = Authentication;
    $scope.classarray = ['I AFM','II AFM','III AFM','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','I SC','II SC','III SC','IV SC','V SC','I MAT','II MAT','III MAT','IV MAT','V MAT','II periodo SSS','III periodo SSS'];
    $scope.indirizzoarray = ['Amministrazione Finanza & Marketing','Liceo Scientifico','Manutenzione e Assistenza Tecnica','Servizi Commerciali','Servizi Socio Sanitari','MAT Serale'];
    $scope.files = [];
    $scope.onLoaded = function () {
      console.log('Google Picker loaded!');
    }; 
    $scope.onPicked = function (docs) {
      angular.forEach(docs, function (file, index) {
        $scope.files.push(file);
      });
    };
    $scope.onCancel = function () {
      console.log('Google picker close/cancel!');
    };
    $scope.removeFile = function(index){
      $scope.files.splice(index, 1);
    };
    // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };  
    // Create new Adoption
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'adoptionForm');

        return false;
      }

      // Create new Adoption object
      var adoption = new Adoptions({
        address: this.address,
        classe: this.classe,
	year: this.year,
	document: []  
      });
      angular.forEach($scope.files,function(file,index){
        adoption.document.push(file);
      });	  
      // Redirect after save
      adoption.$save(function (response) {
        $location.path('adoptions/' + response._id);

        // Clear form fields
        $scope.address = '';
        $scope.classe = '';
	$scope.year = '';
	$scope.document = [];  
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Adoption
    $scope.remove = function (adoption) {
      if (adoption) {
        adoption.$remove();

        for (var i in $scope.adoptions) {
          if ($scope.adoptions[i] === adoption) {
            $scope.adoptions.splice(i, 1);
          }
        }
      } else {
        $scope.adoption.$remove(function () {
          $location.path('adoptions');
        });
      }
    };

    // Update existing Adoption
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'adoptionForm');

        return false;
      }

      var adoption = $scope.adoption;
      if($scope.files.length > 0){
        adoption.document = $scope.files;
      }	
      adoption.$update(function () {
        $location.path('adoptions/' + adoption._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Adoptions
    $scope.find = function () {
      $scope.adoptions = Adoptions.query();
    };

    // Find existing Adoption
    $scope.findOne = function () {
      $scope.adoption = Adoptions.get({
        adoptionId: $stateParams.adoptionId
      });
    };
  }
]);
