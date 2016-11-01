'use strict';

// Teachers controller
angular.module('teachers').controller('AbsencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Absences',
  function ($scope, $stateParams, $location, Authentication, Absences) {
    $scope.authentication = Authentication;
    // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };
    // insert and remove absence  
    $scope.ab_sences=[];
    $scope.addAbsence = function(){
      $scope.ab_sences.push({ date:$scope.absence.date,type:$scope.absence.type,cause:$scope.absence.cause });
    };
    $scope.removeAbsence = function(index){
      $scope.ab_sences.splice(index, 1);
    };
    $scope.abstypes =['ferie','malattia','permesso','assente','altro'];
   
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

    // Create a list to sort   
    $scope.find_ab = function (){
      $scope.t_absence = [];
      angular.forEach($scope.teachers,function(teacher,index){
        angular.forEach(teacher.absences,function(absence,index){
          $scope.t_absence.push({ name:teacher.name, type:absence.type,date:absence.date,cause:absence.cause });
        });
      });  
    };  
      
    // Find existing Teacher
    $scope.findOne = function () {
      $scope.teacher = Absences.get({
        teacherId: $stateParams.teacherId
      });
    };
    // Search for teachers
    $scope.absenceSearch = function(teacher) {
      $location.path('absences/' + teacher._id);
    };  
  }
]);
