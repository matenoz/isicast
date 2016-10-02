'use strict';

angular.module('core').controller('HomeController', ['$scope','Authentication',
  function ($scope,Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    // $scope.user = Authentication.user;
    //   // check if role exists
    // $scope.check = function(value, array) {
    //   if(array.indexOf(value) > -1){
    //     return true;
    //   }
    // };
    // $scope.myInterval = 5000;
    // $scope.noWrapSlides = false;
    // $scope.active = 0;
    // var slides = $scope.slides = [];
    // var currIndex = 0;

    // $scope.addSlide = function() {
    //   var newWidth = 600 + slides.length + 1;
    //   slides.push({
    // 	image: '//unsplash.it/' + newWidth + '/300',
    // 	text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
    // 	  id: currIndex++
    //   });
    // };
   
    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });  
    $scope.popoveRegistro = {
      templateUrl: 'modules/core/client/views/registro-template.html'	  
    };
    // Popover orario
    $scope.popover = {
      templateUrl: 'modules/core/client/views/popover-template.html'	  
    };
  }
]);
