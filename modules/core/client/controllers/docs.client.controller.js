'use strict';

angular.module('core').controller('DocsController',['$scope','$stateParams','$location','Docs',
function($scope,$stateParams, $location, Docs) {
     // Find a list of Docs
  $scope.find = function() {
    $scope.docs = Docs.query();
  };
  $scope.currentPage = 1;
  $scope.pageSize =10;
  $scope.maxSize = 5;
  $scope.offset = 0;
  // Page changed handle
  $scope.pageChanged = function() {
    $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
  };
  $scope.linkClicked = function(link){
    // your code here
    $location.path(link);
  };
  $scope.link = 'https://web.spaggiari.eu/sdg/app/default/comunicati.php?sede_codice=BOII0006&referer=http://ww.isicast.gov.it';
}
  
]);
