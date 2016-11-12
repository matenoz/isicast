'use strict';

// Deadlines controller
angular.module('deadlines').controller('DeadlinesController', ['$scope', '$stateParams', '$location', '$filter','Authentication', 'Deadlines',
  function ($scope, $stateParams, $location, $filter, Authentication, Deadlines) {
    $scope.authentication = Authentication;
    $scope.current_date = new Date();
    $scope.next = function(date){
      var Objdate = new Date(date);
      if(Objdate.getMonth() !== 11){
        $scope.current_date = new Date(Objdate.getFullYear(),Objdate.getMonth() + 1);
      }
      $scope.current_date = new Date(Objdate.getFullYear() +1, Objdate.getMonth() -11);
    };
    $scope.prev = function(date){
      var Objdate = new Date(date);
      if(Objdate.getMonth() !== 0){
        $scope.current_date = new Date(Objdate.getFullYear(),Objdate.getMonth() -1);
      }
      $scope.current_date = new Date(Objdate.getFullYear() -1, Objdate.getMonth() +11);
    };
    $scope.compare = function(a,b){
      var d1 = new Date(a);
      var d2 = new Date(b);
      if (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()){
        return true;
      }
    };
    $scope.pre_dead = new Date();
    $scope.compareDates = function(date1, date2) {
      var dateObj1 = new Date(date1);
      var dateObj2 = new Date(date2);
      if(dateObj1 <= dateObj2 && dateObj2 <= dateObj1.setDate(dateObj1.getDate() + 15)){
        return true;
      }
    }; 
    // Create new Deadline
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'deadlineForm');

        return false;
      }

      // Create new Deadline object
      var deadline = new Deadlines({
        event_date:this.event_date,
        event:this.event,  
        classes: this.classes,
        content: this.content
      });

      // Redirect after save
      deadline.$save(function (response) {
        $location.path('deadlines/' + response._id);

        // Clear form fields
        $scope.event_date = '';
        $scope.event = '';
        $scope.content = '';
        $scope.classes = '';  
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Deadline
    $scope.remove = function (deadline) {
      if (deadline) {
        deadline.$remove();

        for (var i in $scope.deadlines) {
          if ($scope.deadlines[i] === deadline) {
            $scope.deadlines.splice(i, 1);
          }
        }
      } else {
        $scope.deadline.$remove(function () {
          $location.path('deadlines');
        });
      }
    };

    // Update existing Deadline
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'deadlineForm');

        return false;
      }

      var deadline = $scope.deadline;

      deadline.$update(function () {
        $location.path('deadlines/' + deadline._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Deadlines
    $scope.find = function () {
      $scope.deadlines = Deadlines.query();
    };

    // Find existing Deadline
    $scope.findOne = function () {
      $scope.deadline = Deadlines.get({
        deadlineId: $stateParams.deadlineId
      });
    }; 
  }
]);
