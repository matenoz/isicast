'use strict';

// Teachers controller
angular.module('teachers').controller('TimetablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timetables',
  function ($scope, $stateParams, $location, Authentication, Timetables) {
    $scope.authentication = Authentication;

    // Create new Teacher
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teacherForm');

        return false;
      }

      // Create new Teacher object
      var teacher = new Timetables({
        timetable:[]  
      });


      // Redirect after save
      teacher.$save(function (response) {
        $location.path('timetables/' + response._id);

        // Clear form fields
        $scope.timetable =[];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Teacher
    $scope.remove = function (teacher) {
      if (teacher) {
        teacher.$remove();

        for (var i in $scope.teachers) {
          if ($scope.teachers[i] === teacher) {
            $scope.teachers.splice(i, 1);
          }
        }
      } else {
        $scope.teacher.$remove(function () {
          $location.path('teachers');
        });
      }
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
  }
]);
