'use strict';

// Userdocs controller
angular.module('userdocs').controller('UserdocsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Userdocs',
  function ($scope, $stateParams, $location, Authentication, Userdocs) {
    $scope.authentication = Authentication;
    // picker stuff
    $scope.files = [];
    $scope.onLoaded = function () {
      console.log('Google Picker loaded!');
    }; 
    $scope.onPicked = function (docs) {
      angular.forEach(docs, function (file, index) {
        $scope.files.push(file);
      });
    };
    $scope.onCancel = function () {
      console.log('Google picker close/cancel!');
    };
    $scope.removeFile = function(index){
      $scope.files.splice(index, 1);
    };
    // Create new Userdoc
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userdocForm');

        return false;
      }

      // Create new Userdoc object
      var userdoc = new Userdocs({
        title: this.title,
        document: []
      });
      angular.forEach($scope.files,function(file,index){
        userdoc.document.push(file);
      });
      // Redirect after save
      userdoc.$save(function (response) {
        $location.path('userdocs/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.document = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Userdoc
    $scope.remove = function (userdoc) {
      if (userdoc) {
        userdoc.$remove();

        for (var i in $scope.userdocs) {
          if ($scope.userdocs[i] === userdoc) {
            $scope.userdocs.splice(i, 1);
          }
        }
      } else {
        $scope.userdoc.$remove(function () {
          $location.path('userdocs');
        });
      }
    };

    // Update existing Userdoc
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userdocForm');

        return false;
      }

      var userdoc = $scope.userdoc;
      if($scope.files.length > 0){
        userdoc.document = $scope.files;
      }
      userdoc.$update(function () {
        $location.path('userdocs/' + userdoc._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Userdocs
    $scope.find = function () {
      $scope.userdocs = Userdocs.query();
    };

    // Find existing Userdoc
    $scope.findOne = function () {
      $scope.userdoc = Userdocs.get({
        userdocId: $stateParams.userdocId
      });
    };
  }
]);
