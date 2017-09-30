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
    $scope.dis = [{ name:'prog' },{ name:'disp' }];  
    $scope.nameOfHours = ['I','II','III','IV','V','VI','VII','VIII'];
    $scope.nameOfDays = ['lunedi','martedi','mercoledi','giovedi','venerdi'];
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };  

    // create a hours' container for each hour and day of the week
    var container_gen = function(){
      var container = [];
      var ore = ['I','II','III','IV','V','VI','VII','VIII'];
      var giorni = ['lunedi','martedi','mercoledi','giovedi','venerdi'];
      var ore_disp = {};
      for (var i=0; i <ore.length; i++){
        ore_disp.nome_ora = ore[i];
        for (var j=0; j <giorni.length; j++){
          ore_disp[giorni[j]] = [];
        }
        container.push(ore_disp);
        ore_disp = {};
      }
      return container;
    };

    $scope.ownsubclass = function(_classe){
      $scope.ownsub = [];
      angular.forEach($scope.teacher.classes, function(classe, index){
        if(_classe === classe.name && classe.subclass !== ''){
          $scope.ownsub.push(classe.subclass);
        }
      });
    };

    // create timetable list with hour, day, subject, class and subclass
    $scope.hours = [];
    $scope.addHour = function(){
      $scope.hours.push({ day:$scope.day, hour:$scope.hour, classe:$scope.classe, subclass:$scope.subclass, subject:$scope.subject, availability:$scope.availability });
    };
        
    
    // remove hour from local timetable
    $scope.removeHour = function(index){
      $scope.hours.splice(index, 1);
    };
    // remove hour from persistent timetable
    $scope.removeHours = function(index){
      $scope.teacher.timetable.splice(index, 1);
    };
    
    // Update existing Teacher
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teacherForm');

        return false;
      }

      var teacher = $scope.teacher;
      angular.forEach($scope.hours, function(hour,index){
        teacher.timetable.push({ day:hour.day, hour:hour.hour, classe:hour.classe, subclass:hour.subclass, subject:hour.subject,availability:hour.availability });
      });      
      
      teacher.$update(function () {
        $location.path('timetables/' + teacher._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.generateGlobalTable = function(){
      $scope.teachers = Timetables.query({}, function(){
        $scope.globalcontainer = [];
        var container = {};
        var day_hours = {};
        angular.forEach($scope.teachers, function(teacher, index){
          angular.forEach(teacher.timetable, function(hour, index){
            if(hour.classe !== ''){
              container[hour.day] = day_hours;
              day_hours[hour.hour] = hour.classe;
              day_hours = {};
            }
          },$scope.globalcontainer.push({ name: teacher.name, container:container }));
          container = {};
        }); 
      });
    };
        
    // generate teacher' timetable
    $scope.generateTable = function(){
      $scope.teacher = Timetables.get({
        teacherId: $stateParams.teacherId
      }, function(){
        $scope.container = container_gen();
        angular.forEach($scope.teacher.timetable, function(hour, index){
          angular.forEach($scope.container, function(hour_container, index){
            if (hour.hour === hour_container.nome_ora){
              if(hour.classe !== undefined){ 
                hour_container[hour.day].push(hour.classe); 
              }
              else if (hour.availability !== undefined){
                hour_container[hour.day].push(hour.availability);
              }
            }
          });
        });
      });
    };
    
    // Find a list of teachers' availabilties
    $scope.getAvailability = function(){
      $scope.teachers = Timetables.query({}, function(){
        $scope.container = container_gen();
        angular.forEach($scope.teachers, function(teacher,index){
          angular.forEach(teacher.timetable, function(hour,index){
            angular.forEach($scope.container, function(hour_container,index){
              if(hour.availability === 'prog' || hour.availability === 'disp'){
                if(hour.hour === hour_container.nome_ora){
                  hour_container[hour.day].push(teacher.name); 
                }
              }
            });
          });	  
        });
      });
    };
    // initiate getAvailability
    $scope.showAvailability = function(){
      $scope.getAvailability();
    };
    // Find a list of Teachers
    $scope.find = function () {
      $scope.teachers = Timetables.query();
    };

    $scope.globalTable = function(){
      $scope.generateGlobalTable();
    };
    
    $scope.findOne = function () {
      $scope.generateTable();
    };
    
      // Search for documents
    $scope.timetableSearch = function(teacher) {
      $location.path('timetables/' + teacher._id);
    };
  }
]);
