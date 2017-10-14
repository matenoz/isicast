'use strict';

// Classes controller
angular.module('classes').controller('ClassesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Classes',
  function ($scope, $stateParams, $location, Authentication,Classes) {
    $scope.authentication = Authentication;
    $scope.indirizzoarray = ['Amministrazione Finanza & Marketing','Liceo Scientifico','Manutenzione e Assistenza Tecnica','Servizi Commerciali','Servizi Socio Sanitari','MAT Serale'];
    $scope._teachers = [];
    $scope.addTeacher = function(){
      $scope._teachers.push({ name:$scope.teacher.name, materia:$scope.teacher.materia });
      $scope.alerts.push({ msg:'Docente associato correttamente. Clicca Update per aggiornare o associa altro Docente' });
    };
    $scope.subClasses = [];
    $scope.addSubClass = function(){
      $scope.subClasses.push({ name:$scope.subclass });
      $scope.subclass = '';
    };
    $scope.removeSubClass = function(index){
      $scope.subClasses.splice(index, 1);
    };
    $scope.removesubclass = function(index){
      $scope.classe.subclasses.splice(index, 1);
    };
    $scope.removeTeacher = function(index){
      $scope._teachers.splice(index, 1);
    };
    $scope.removeupdateTeacher = function(index){
      $scope.classe.teachers.splice(index, 1);
    };
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    // choose teacher subject
    $scope.choosesubject = function(name){
      $scope.subjects = [];
      angular.forEach($scope.teachers_,function(teacher,index){
        if (teacher.name === name){
          angular.forEach(teacher.materia,function(subject, index){
            $scope.subjects.push(subject);
          });
        }
      });
    };  
      
    // Create new Classe
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'classeForm');

        return false;
      }

      // Create new Classe object
      var classe = new Classes.c({
        nome_classe: this.nome_classe,
        indirizzo: this.indirizzo,
        subclasses:[],
        teachers:[],
        coordinatore:this.coordinatore,    
      });

      // push element in classes   
      angular.forEach($scope._teachers, function(teacher,index){
        classe.teachers.push({ name:teacher.name,materia:teacher.materia });
      });		
      angular.forEach($scope.subClasses, function(subclass, index){
        classe.subclasses.push({ name:subclass.name });
      });
      // Redirect after save
      classe.$save(function (response) {
        $location.path('classes/' + response._id);

        // Clear form fields
        $scope.nome_classe = '';
        $scope.indirizzo = '';
        $scope.subclasses = [];
        $scope.teachers = [];
        $scope.coordinatore = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Classe
    $scope.remove = function (classe) {
      if (classe) {
        classe.$remove();

        for (var i in $scope.classes) {
          if ($scope.classes[i] === classe) {
            $scope.classes.splice(i, 1);
          }
        }
      } else {
        $scope.classe.$remove(function () {
          $location.path('classes');
        });
      }
    };

    // Update existing Classe
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'classeForm');

        return false;
      }

      var classe = $scope.classe;
      angular.forEach($scope._teachers, function(teacher,index){
        classe.teachers.push({ name:teacher.name,materia:teacher.materia });
      });
      angular.forEach($scope.subClasses, function(subclass, index){
        classe.subclasses.push({ name:subclass.name });
      });
      	
      classe.$update(function () {
        $location.path('classes/' + classe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Classes
    $scope.find = function () {
      $scope.classes = Classes.c.query();
    };

    var generate_table = function(){
      var container = [];
      var hours = ['I','II','III','IV','V','VI','VII','VIII'];
      var days = ['lunedi','martedi','mercoledi','giovedi','venerdi'];
      var availability = {};
      for (var i=0; i <hours.length; i++){
        availability.hour = hours[i];
        for (var j=0; j <days.length; j++){
          availability[days[j]] = [];
        }
        container.push(availability);
        availability = {};
      }
      return container;
    };
    
    $scope.getTimetable = function(){
      $scope.teachers = Classes.t.query({}, function(){
        $scope.classe = Classes.c.get({
          classeId: $stateParams.classeId
        }, function(){
          $scope.container = generate_table();
          angular.forEach($scope.teachers, function(teacher,index){
            angular.forEach(teacher.timetable, function(hour, index){
              angular.forEach($scope.container, function(hour_container,index){
                if(hour.classe === $scope.classe.nome_classe && hour.hour === hour_container.hour){
                  hour_container[hour.day].push(teacher.name + ' - ' + hour.subject);
                }
              });
            });
          });
        });
      });
    };
    $scope.subclassTimetable = function(subclass){
      $scope.container = generate_table();
      angular.forEach($scope.teachers, function(teacher,index){
        angular.forEach(teacher.timetable, function(hour,index){
          angular.forEach($scope.container, function(hour_container, index){
            if(hour.classe === $scope.classe.nome_classe && (hour.subclass === subclass || hour.subclass === '') && hour.hour === hour_container.hour){
              hour_container[hour.day].push(teacher.name + ' - ' + hour.subject);
            }
          });
        });
      });
    };
    $scope.timeTable = function () {
      $scope.getTimetable();
    };
    
    $scope.find_t = function () {
      $scope.teachers_ = Classes.t.query();
    };  

    // Find existing Classe
    $scope.findOne = function () {
      $scope.classe = Classes.c.get({
        classeId: $stateParams.classeId
      });
    };
  }
]);

