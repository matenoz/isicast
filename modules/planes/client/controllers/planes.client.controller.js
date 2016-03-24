'use strict';

// Planes controller
angular.module('planes').controller('PlanesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Planes',
  function ($scope, $stateParams, $location, Authentication, Planes) {
    $scope.authentication = Authentication;
    // list classes
    $scope.classarray = ['I AFM','II AFM','III AFM','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','I SC','II SC','III SC','IV SC','V SC','I MAT','II MAT','III MAT','IV MAT','V MAT','II periodo SSS','III periodo SSS','II periodo MAT','III periodo MAT'];
    $scope.axis = ['Asse dei linguaggi','Asse matematico','Asse storico - sociale','Asse scientifico - tecnologico'];
    // date comparision  
    $scope.compareDates = function(date1, date2) {
      var dateObj1 = new Date(date1);
      var dateObj2 = new Date(date2);
      return (dateObj1 <= dateObj2);
    };
      
    // picker stuff
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
    // Create new Plane
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'planeForm');

        return false;
      }

      // Create new Plane object
      var plane = new Planes({
        updated: this.updated,
        content: [],
        classes: this.classes,
        year: this.year,
        materia: this.materia,  
        department: this.department  
      });
      angular.forEach($scope.files,function(file,index){
        plane.content.push(file);
      });
      plane.updated = Date.now();	

      // Redirect after save
      plane.$save(function (response) {
        $location.path('planes/' + response._id);

        // Clear form fields
        $scope.content = [];
        $scope.classes = '';
        $scope.year = '';  
        $scope.materia ='';
        $scope.department = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Plane
    $scope.remove = function (plane) {
      if (plane) {
        plane.$remove();

        for (var i in $scope.planes) {
          if ($scope.planes[i] === plane) {
            $scope.planes.splice(i, 1);
          }
        }
      } else {
        $scope.plane.$remove(function () {
          $location.path('planes');
        });
      }
    };

    // Update existing Plane
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'planeForm');

        return false;
      }

      var plane = $scope.plane;
      plane.updated = Date.now();
      if($scope.files.length > 0){
        plane.content = $scope.files;
      }		
      plane.$update(function () {
        $location.path('planes/' + plane._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Planes
    $scope.find = function () {
      $scope.planes = Planes.query();
    };

    // Find existing Plane
    $scope.findOne = function () {
      $scope.plane = Planes.get({
        planeId: $stateParams.planeId
      });
    };
  }
]);
