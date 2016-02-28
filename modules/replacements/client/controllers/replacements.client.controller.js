'use strict';

// Replacements controller
angular.module('replacements').controller('ReplacementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Replacements',
  function ($scope, $stateParams, $location, Authentication, Replacements) {
    $scope.authentication = Authentication;

    // Create new Replacement
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'replacementForm');

        return false;
      }

      // Create new Replacement object
      var replacement = new Replacements({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      replacement.$save(function (response) {
        $location.path('replacements/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Replacement
    $scope.remove = function (replacement) {
      if (replacement) {
        replacement.$remove();

        for (var i in $scope.replacements) {
          if ($scope.replacements[i] === replacement) {
            $scope.replacements.splice(i, 1);
          }
        }
      } else {
        $scope.replacement.$remove(function () {
          $location.path('replacements');
        });
      }
    };

    // Update existing Replacement
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'replacementForm');

        return false;
      }

      var replacement = $scope.replacement;

      replacement.$update(function () {
        $location.path('replacements/' + replacement._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Replacements
    $scope.find = function () {
      $scope.replacements = Replacements.query();
    };

    // Find existing Replacement
    $scope.findOne = function () {
      $scope.replacement = Replacements.get({
        replacementId: $stateParams.replacementId
      });
    };
  }
]);
