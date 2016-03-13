'use strict';

angular.module('core').controller('RulesController',['$scope','$stateParams','$location','Rules',
function($scope,$stateParams, $location, Rules) {
     // Find a list of Rules
  $scope.find = function() {
    $scope.rules = Rules.query();
  };
}
]);
