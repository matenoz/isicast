'use strict';

// Planes controller
angular.module('planes').controller('PlanesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Planes',
  function ($scope, $stateParams, $location, $filter, Authentication, Planes) {
    $scope.authentication = Authentication;
    // list classes
    $scope.classarray = ['I AFM','II AFM','III AFM','III AFM A','III AFM B','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','II SC','III SC PCP','IV SC PCP','V SC PCP','I MAT', 'I ART. MAT/SC','II MAT','III MAT impianti','IV MAT impianti','V MAT impianti','III MAT trasporti','IV MAT trasporti','V MAT trasporti','II periodo SSS','III periodo SSS','II periodo MAT'];  
    $scope.axis = ['Asse dei linguaggi','Asse matematico','Asse storico - sociale','Asse scientifico - tecnologico'];
    // show current year planes date
    $scope.currentYear = new Date();
    $scope.nextYear = new Date();
    if ($scope.currentYear.getMonth() < 10){
      $scope.currentYear.setYear($scope.currentYear.getFullYear()-1);
      $scope.nextYear.setYear($scope.nextYear.getFullYear());
    } else {
      $scope.currentYear.setYear($scope.currentYear.getFullYear());
      $scope.nextYear.setYear($scope.nextYear.getFullYear()+1);
    }
    $scope.currYear = $filter('date')($scope.currentYear,'yyyy');
    $scope.next_Year = $filter('date')($scope.nextYear,'yyyy');  
    $scope.prev = function(){
      $scope.currentYear.setYear($scope.currentYear.getFullYear()-1);
      $scope.currYear = $filter('date')($scope.currentYear,'yyyy');	 
      $scope.nextYear.setYear($scope.nextYear.getFullYear()-1);	
      $scope.next_Year = $filter('date')($scope.nextYear,'yyyy');
    };
    $scope.next = function(){
      $scope.currentYear.setYear($scope.currentYear.getFullYear()+1);     
      $scope.currYear = $filter('date')($scope.currentYear,'yyyy');
      $scope.nextYear.setYear($scope.nextYear.getFullYear()+1);	
      $scope.next_Year = $filter('date')($scope.nextYear,'yyyy');
    };   
    // date comparision  
    $scope.compareDates = function(dateP, dateC) {
      var progdate = new Date(dateP);
      var current = new Date (dateC);
      if (current.getMonth() < 10) {
        return (progdate.getFullYear()-1 === current.getFullYear()-1);
      } else {
        return (progdate.getFullYear() === current.getFullYear());   	
      }
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
