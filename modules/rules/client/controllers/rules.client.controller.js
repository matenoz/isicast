'use strict';

// Rules controller
angular.module('rules').controller('RulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rules',
  function ($scope, $stateParams, $location, Authentication, Rules) {
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
    // Create new Rule
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ruleForm');

        return false;
      }

      // Create new Rule object
      var rule = new Rules({
        title: this.title,
        document: [],
        link: this.link,  
        updated: this.updated,
        isFrame:this.isFrame
      });
      angular.forEach($scope.files,function(file,index){
        rule.document.push(file);
      });
      rule.updated = Date.now();	
	
      // Redirect after save
      rule.$save(function (response) {
        $location.path('rules/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.document = [];
        $scope.link = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Rule
    $scope.remove = function (rule) {
      if (rule) {
        rule.$remove();

        for (var i in $scope.rules) {
          if ($scope.rules[i] === rule) {
            $scope.rules.splice(i, 1);
          }
        }
      } else {
        $scope.rule.$remove(function () {
          $location.path('rules');
        });
      }
    };

    // Update existing Rule
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ruleForm');

        return false;
      }

      var rule = $scope.rule;
      rule.updated = Date.now();
      if($scope.files.length > 0){
        rule.document = $scope.files;
      }	
      rule.$update(function () {
        $location.path('rules/' + rule._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Rules
    $scope.find = function () {
      $scope.rules = Rules.query();
    };

    // Find existing Rule
    $scope.findOne = function () {
      $scope.rule = Rules.get({
        ruleId: $stateParams.ruleId
      });
    };
  }
]);
