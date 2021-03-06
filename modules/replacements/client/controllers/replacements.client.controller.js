'use strict';

// Replacements controller
angular.module('replacements').controller('ReplacementsController', ['$filter','$scope', '$stateParams', '$location', 'Authentication', 'Replacements', function ($filter,$scope, $stateParams, $location, Authentication, Replacements) {
  $scope.authentication = Authentication;
  $scope.control = true;
  $scope.dailyreps = [];
  $scope.addRep = function(){
    $scope.dailyreps.push({ hour:$scope.rep.hour, classe:$scope.rep.classe, absent:$scope.rep.absent, substitute:$scope.rep.substitute });  
    $scope.alerts.push({ msg:'Sostituzione inserita correttamente. Clicca Invia o Update per aggiornare, oppure inserisci altra sostituzione'
    });
    $scope.rep.hour = '';
    $scope.rep.classe = '';
    $scope.rep.substitute = '';
    $scope.teamteachers = '';
  };
  $scope.removeRep = function(index){
    $scope.dailyreps.splice(index, 1);
    $scope.alerts.push({ msg:'Sostituzione rimossa correttamente. Cliccare invia per salvare o continua ad aggiornare le sostituzioni.' });  
  };
  $scope.removeUpdate = function(index){
    $scope.replacement.daily_reps.splice(index, 1);
    $scope.alerts.push({ msg:'Sostituzione rimossa correttamente. Cliccare update oppure continua ad aggiornare le sostituzioni.' });  
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
  $scope.availbilityview = function(absdate){
    $scope.availables = [];
    $scope.giorno = $filter('date')(absdate,'EEEE').replace(/ì/i, 'i');
    angular.forEach($scope.teachers, function(teacher,index){
      angular.forEach(teacher.timetable, function(hour, index){
        if(hour.availability === 'disp' || hour.availability=== 'prog'){
          $scope.availables.push({ hour:hour.hour, day:hour.day, teacher:teacher.name });
        }
      });
    });
  };
  $scope.removeAvailable = function(index){
    $scope.availables.splice(index, 1);
  };
  // find teacher that matches absence's date
  $scope.checkabsence = function(absdate){
    $scope.teachers_absent = [];
    angular.forEach($scope.teachers, function(teacher,index){
      angular.forEach(teacher.absences,function(absence,index){
        if ($filter('date')(absence.date,'dd/MM/yyyy') === $filter('date')(absdate,'dd/MM/yyyy')){
          $scope.teachers_absent.push(teacher);
        }
      });
    });	
  };
  // check in which hours are forseen replacement
  $scope.checkhours = function(name, absdate){
    $scope.ab_hours =[];
    var giorno = $filter('date')(absdate,'EEEE').replace(/ì/i, 'i');
    angular.forEach($scope.teachers,function(teacher,index){
      if (teacher.name === name){
        angular.forEach(teacher.timetable,function(hour,index){
          if (hour.day === giorno && hour.classe !== ''){
            $scope.ab_hours.push({ ora:hour.hour, classe:hour.classe, subclass:hour.subclass });    
          }
        });	
      }
    });
  };
  // check team teaching hours
  $scope.searchTeamTeaching = function(teacher, hour, day, classe){
    var _day = $filter('date')(day,'EEEE').replace(/ì/i, 'i');
    var _hour = hour;
    var _teacher = teacher;
    var _classe = classe;
    $scope.teamteachers = [];
    angular.forEach($scope.teachers, function(teacher, index){
      angular.forEach(teacher.timetable, function(hour, index){
        if(hour.day === _day && hour.hour === _hour && hour.classe === _classe && teacher.name !== _teacher){
          $scope.teamteachers.push('compresenza: '+ teacher.name);
          $scope.sub_teachers.push({ name:teacher.name });
        }	
      });
    });
  };
  // check which teacher can replace  
  $scope.substitute = function(sub_hour, absdate){
    $scope.sub_teachers = [];
    var giorno = $filter('date')(absdate,'EEEE').replace(/ì/i, 'i');
    angular.forEach($scope.teachers, function(teacher,index){
      angular.forEach(teacher.timetable,function(hour, index){
        if (hour.hour === sub_hour){
          if (hour.day === giorno && hour.availability === 'disp' || hour.day === giorno && hour.availability === 'prog'){
            $scope.sub_teachers.push({ name: teacher.name });
          }
        }
      });
    });
  };
  $scope.removeHours = function(index){
    $scope.replacement.daily_reps.splice(index, 1);
    $scope.alerts.push({ msg:'Sostituzione rimossa correttamente. Cliccare update oppure continua ad aggiornare le sostituzioni.' });
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
    /* angular.forEach(replacement.daily_reps,function(rep,index){
     *   if(rep.isActive === false){
     *     replacement.daily_reps.splice(index, 1);
     *   }
     * });*/
    
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
