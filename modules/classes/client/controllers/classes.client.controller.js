'use strict';

// Classes controller
angular.module('classes').controller('ClassesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Classes',
  function ($scope, $stateParams, $location, Authentication,Classes) {
    $scope.authentication = Authentication;
    $scope.classarray = ['I AFM','II AFM','III AFM','IV AFM','V AFM','I AL','II AL','III AL','IV AL','V AL','I SC','II SC','III SC','IV SC','V SC','I MAT','II MAT','III MAT','IV MAT','V MAT','II periodo SSS','III periodo SSS'];
    $scope.indirizzoarray = ['Amministrazione Finanza & Marketing','Liceo Scientifico','Manutenzione e Assistenza Tecnica','Servizi Commerciali','Servizi Socio Sanitari'];
    $scope._teachers = [];
    $scope.addTeacher = function(){
      $scope._teachers.push({ name:$scope.teacher.name, materia:$scope.teacher.materia });
      $scope.alerts.push({ msg:'Docente associato correttamente. Clicca Update per aggiornare o associa altro Docente' });
    };

    $scope.removeTeacher = function(index){
      $scope._teachers.splice(index, 1);
    };

    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
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
        teachers:[],
        coordinatore:this.coordinatore,  
        timetable:[]  
      });
      // create a empty timetable
      classe.timetable.push({ nome_ora:'08 - 09', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'09 - 10', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'10 - 11', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'11 - 12', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'12 - 13', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'13 - 14', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'14 - 15', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' },{ nome_ora:'15 - 16', lunedi:'',martedi:'',mercoledi:'',giovedi:'',venerdi:'' });

      // push element in classes   
      angular.forEach($scope._teachers, function(teacher,index){
        classe.teachers.push({ name:teacher.name,materia:teacher.materia });
      });		
	
      // Redirect after save
      classe.$save(function (response) {
        $location.path('classes/' + response._id);

        // Clear form fields
        $scope.nome_classe = '';
        $scope.indirizzo = '';
        $scope.teachers = [];
        $scope.coordinatore = '';
        $scope.timetable = [];
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
      angular.forEach(classe.teachers,function(teacher,index){
        if(teacher.isActive === false){
          classe.teachers.splice(index, 1);
        }
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

