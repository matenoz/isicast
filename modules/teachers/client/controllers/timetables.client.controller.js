'use strict';

// Teachers controller
angular.module('teachers').controller('TimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timetables',
  function ($scope, $stateParams, $location, Authentication, Timetables) {
    $scope.authentication = Authentication;
    // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    // disposizioni
    $scope.setdisp = false;
    $scope.changeList = function(list){
      if($scope.setdisp === false){
        return list ;
      }
      return $scope.dis;
    };
    $scope.dis = [{ name:'prog' },{ name:'disp' },{ name:'ric' },{ name:'funz' },{ name:'alt' }];  
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };  
   
    // Update existing Teacher
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teacherForm');

        return false;
      }

      var teacher = $scope.teacher;
      
      teacher.$update(function () {
        $location.path('timetables/' + teacher._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Teachers
    $scope.find = function () {
      $scope.teachers = Timetables.query();
    };

    // Find existing Teacher
    $scope.findOne = function () {
      $scope.teacher = Timetables.get({
        teacherId: $stateParams.teacherId
      });	
    };
    // Search for documents
    $scope.timetableSearch = function(teacher) {
      $location.path('timetables/' + teacher._id);
    };
  }
]);
