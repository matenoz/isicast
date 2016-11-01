'use strict';

// Teachers controller
angular.module('teachers').controller('TeachersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teachers',
  function ($scope, $stateParams, $location, Authentication, Teachers) {
    $scope.authentication = Authentication;
     // check if role exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
    $scope.subject =[];  
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };
   
    $scope.indirizzoarray = ['Amministrazione Finanza & Marketing','Liceo Scientifico','Manutenzione e Assistenza Tecnica','Servizi Commerciali','Servizi Socio Sanitari','Manut.ne Assist.za Tecnica serale'];
    $scope._class = [];
    $scope.addClass = function(){
      $scope._class.push({ name:$scope.classe.name, indirizzo:$scope.classe.indirizzo });
      $scope.alerts.push({ msg:'Classe associata correttamente. Clicca Update per aggiornare o associa altra Classe' });
    };

    $scope.removeClass = function(index){
      $scope._class.splice(index, 1);
    };
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };    
    // Create new Teacher
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teacherForm');

        return false;
      }

      // Create new Teacher object
      var teacher = new Teachers.t({
        name: this.name,
        materia: this.materia,  
        coordinator:this.coordinator,
        classes:[],
        timetable:[]  
      });
      
      // create a empty timetable
      teacher.timetable.push({ nome_ora:'I', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'II', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'III', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'IV', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'V', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'VI', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'VII', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' },{ nome_ora:'VIII', lunedì:'',martedì:'',mercoledì:'',giovedì:'',venerdì:'' });
    
      // push element in classes   
      angular.forEach($scope._class, function(classe,index){
        teacher.classes.push({ name:classe.name,indirizzo:classe.indirizzo });
      });	
      // Redirect after save
      teacher.$save(function (response) {
        $location.path('teachers/' + response._id);

        // Clear form fields
        $scope.name = '';
          // $scope.materia = '';
        $scope.materia = [];  
        $scope.coordinator = '';
        $scope.classes = [];
        $scope.timetable = [];
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
      angular.forEach($scope._class, function(classe,index){
        teacher.classes.push({ name:classe.name,indirizzo:classe.indirizzo });
      });
      // angular.forEach($scope.materia, function(item, index){
      //   teacher.materia.push(item[index]);
      // });
	
      angular.forEach(teacher.classes,function(classe,index){
        if(classe.isActive === false){
          teacher.classes.splice(index, 1);
        }
      });	

      	
      teacher.$update(function () {
        $location.path('teachers/' + teacher._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
     
    // Find a list of Teachers
    $scope.find = function () {
      $scope.teachers = Teachers.t.query();
    };
    $scope.findc = function () {
      $scope._classes = Teachers.c.query();
    };
    // Find existing Teacher
    $scope.findOne = function () {
      $scope.teacher = Teachers.t.get({
        teacherId: $stateParams.teacherId
      });
    };
     // Search for teachers
    $scope.teacherSearch = function(teacher) {
      $location.path('teachers/' + teacher._id);
    };   
  }
]);
