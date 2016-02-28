'use strict';

/**
 * Edits by Massimo Esposito
 * Credit: https://github.com/matenoz/isicast */

angular.module('core').directive('searchField', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      scope.$apply(function (){
        scope.$eval(attrs.ngEnter);
      });
      event.preventDefault();
    });
  };
});
