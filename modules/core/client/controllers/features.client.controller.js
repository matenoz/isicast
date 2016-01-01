'use strict';

angular.module('core').controller('FeaturesController', ['$scope', '$stateParams', '$location', 'Features',
  function($scope, $stateParams, $location, Features) {
              $scope.find = function() {
                $scope.features = Features.query();
		};
	}
]);
