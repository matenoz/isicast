'use strict';

// Features controller
angular.module('features').controller('FeaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Features',
  function ($scope, $stateParams, $location, Authentication, Features) {
    $scope.authentication = Authentication;
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.offset = 0;
    // Page changed handle
    $scope.pageChanged = function() {
      $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
    };

    $scope.pre_dead = new Date();
    $scope.compareDates = function(date1, date2) {
      var dateObj1 = new Date(date1);
      var dateObj2 = new Date(date2);
      return (dateObj1 <= dateObj2);
    };
    // google picker
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
        content: this.content,
        img: [],
        link: this.link, 
        deadline: this.deadline,
        priority: this.priority
      });
      angular.forEach($scope.files,function(file,index){
        feature.img.push(file);
      }); 
      // Redirect after save
      feature.$save(function (response) {
        $location.path('features/' + response._id);

              // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.link = '';
        $scope.deadline = '';  
        $scope.priority = '';  
        $scope.img = [];  
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
      if($scope.files.length > 0){
        feature.img = $scope.files;
      }
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
    // Search for documents
    $scope.featureSearch = function(feature) {
      $location.path('features/' + feature._id);
    };
  }
]);
