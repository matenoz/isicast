'use strict';

// Teachers controller
angular.module('teachers').controller('TeachersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teachers',
  function ($scope, $stateParams, $location, Authentication, Teachers) {
    $scope.authentication = Authentication;
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize =10;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };
    // insert and remove class  
    $scope.classarray = ['I AFM','II AFM','III AFM','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','I SC','II SC','III SC','IV SC','V SC','I MAT','II MAT','III MAT','IV MAT','V MAT','II periodo SSS','III periodo SSS'];
    $scope.indirizzoarray = ['Amministrazione Finanza & Marketing','Liceo Scientifico','Manutenzione e Assistenza Tecnica','Servizi Commerciali','Servizi Socio Sanitari'];
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
      var teacher = new Teachers({
        name: this.name,
        materia: this.materia,
        coordinator:this.coordinator,
        classes:[],
        timetable:[]  
      });
      
      // create a empty timetable
      teacher.timetable.push({ nome_ora:'08 - 09', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'09 - 10', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'10 - 11', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'11 - 12', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'12 - 13', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'13 - 14', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'14 - 15', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'15 - 16', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' });
    
      // push element in classes   
      angular.forEach($scope._class, function(classe,index){
        teacher.classes.push({ name:classe.name,indirizzo:classe.indirizzo });
      });	
      // Redirect after save
      teacher.$save(function (response) {
        $location.path('teachers/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.materia = '';
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
      $scope.teachers = Teachers.query();
    };

    // Find existing Teacher
    $scope.findOne = function () {
      $scope.teacher = Teachers.get({
        teacherId: $stateParams.teacherId
      });
    };
     // Search for teachers
    $scope.teacherSearch = function(teacher) {
      $location.path('teachers/' + teacher._id);
    };   
  }
]);
