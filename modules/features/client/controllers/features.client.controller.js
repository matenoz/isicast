'use strict';

// Features controller
angular.module('features').controller('FeaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Features', function ($scope, $stateParams, $location, Authentication, Features) {
    $scope.authentication = Authentication;
    // Create new Feature
    $scope.create = function (isValid) {
      $scope.error = null;

	if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'featureForm');

            return false;
	}

	// Create new Feature object
	var feature = new Features({
            title: this.title,
            content: this.content
	});

	// Redirect after save
	feature.$save(function (response) {
            $location.path('features/' + response._id);

            // Clear form fields
            $scope.title = '';
            $scope.content = '';
	}, function (errorResponse) {
            $scope.error = errorResponse.data.message;
	});
    };

    // Remove existing Feature
    $scope.remove = function (feature) {
	if (feature) {
            feature.$remove();

            for (var i in $scope.features) {
		if ($scope.features[i] === feature) {
		    $scope.features.splice(i, 1);
		}
            }
	} else {
            $scope.feature.$remove(function () {
		$location.path('features');
            });
	}
    };

    // Update existing Feature
    $scope.update = function (isValid) {
	$scope.error = null;

	if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'featureForm');

            return false;
	}

	var feature = $scope.feature;

	feature.$update(function () {
            $location.path('features/' + feature._id);
	}, function (errorResponse) {
            $scope.error = errorResponse.data.message;
	});
    };

    // Find a list of Features
    $scope.find = function () {
	$scope.features = Features.query();
    };

    // Find existing Feature
    $scope.findOne = function () {
	$scope.feature = Features.get({
            featureId: $stateParams.featureId
	});
    };
}
]);
