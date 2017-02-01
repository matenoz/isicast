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
    $scope.dis = [{ name:'prog' },{ name:'disp' },{ name:'ric' },{ name:'funz' },{ name:'alt' }];  
    $scope.setdisp = false;
    $scope.changeList = function(list){
      if($scope.setdisp === false){
        return list ;
      }
      return $scope.dis;
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

    var disp_timetable = function(){
      var disposizioni = [];
      angular.forEach($scope.teachers, function(teacher,index){
        angular.forEach(teacher.timetable, function(hour, index){
          angular.forEach(hour, function(value, key){
            if(hour[key] === 'disp' || hour[key] === 'prog'){
              disposizioni.push({ ora:hour.nome_ora, giorno:key, docente:teacher.name });      
            }
          });
        });
      });
      return disposizioni;

    };
    $scope.avail_hours = function(){
      var p_hours = disp_timetable();
      $scope.newdisp = [
	{ nome_ora: 'I', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'II', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'III', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'IV', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'V', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'VI', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'VII', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] },
	{ nome_ora: 'VIII', lunedi:[], martedi:[], mercoledi:[], giovedi:[], venerdi:[] }
      ];
     
      angular.forEach(p_hours, function(p_hour, index){
        angular.forEach($scope.newdisp, function(hour_container, index){
          if (p_hour.ora === hour_container.nome_ora){
            hour_container[p_hour.giorno].push(p_hour.docente);
          }
        });
      });
      return true;
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
