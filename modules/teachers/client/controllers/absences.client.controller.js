'use strict';

// Teachers controller
angular.module('teachers').controller('AbsencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Absences',
  function ($scope, $stateParams, $location, Authentication, Absences) {
    $scope.authentication = Authentication;
    $scope.ab_sences=[];
    $scope.addAbsence = function(){
      $scope.ab_sences.push({ date:$scope.absence.date,type:$scope.absence.type,cause:$scope.absence.cause });
    };
  
    $scope.abstypes =['ferie','malattia','permesso','assente','altro'];
    // Create new Teacher
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teacherForm');

        return false;
      }

      // Create new Teacher object
      var teacher = new Absences({
        name: this.name,
        absences:[]  
      });


      // Redirect after save
      teacher.$save(function (response) {
        $location.path('absences/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.absences =[];
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
      angular.forEach($scope.ab_sences,function(absence,index){
        teacher.absences.push({ date:absence.date,type:absence.type,cause:absence.cause });  
      });
      	
      teacher.$update(function () {
        $location.path('absences/' + teacher._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Teachers
    $scope.find = function () {
      $scope.teachers = Absences.query();
    };

    // Find existing Teacher
    $scope.findOne = function () {
      $scope.teacher = Absences.get({
        teacherId: $stateParams.teacherId
      });
    };
  }
]);
