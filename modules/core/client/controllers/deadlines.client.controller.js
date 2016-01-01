'use strict';

angular.module('core').controller('DeadlinesController', ['$scope', '$stateParams','$location', 'Deadlines',function($scope, $stateParams, $location, Deadlines) {
  $scope.find = function() {
    $scope.deadlines = Deadlines.query();
  };
	}
]);
