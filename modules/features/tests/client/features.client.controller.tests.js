'use strict';

(function () {
  // Features Controller Spec
  describe('Features Controller Tests', function () {
    // Initialize global variables
    var FeaturesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Features,
      mockFeature;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Features_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Features = _Features_;

      // create mock feature
      mockFeature = new Features({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Feature about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Features controller.
      FeaturesController = $controller('FeaturesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one feature object fetched from XHR', inject(function (Features) {
      // Create a sample features array that includes the new feature
      var sampleFeatures = [mockFeature];

      // Set GET response
      $httpBackend.expectGET('api/features').respond(sampleFeatures);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.features).toEqualData(sampleFeatures);
    }));

    it('$scope.findOne() should create an array with one feature object fetched from XHR using a featureId URL parameter', inject(function (Features) {
      // Set the URL parameter
      $stateParams.featureId = mockFeature._id;

      // Set GET response
      $httpBackend.expectGET(/api\/features\/([0-9a-fA-F]{24})$/).respond(mockFeature);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.feature).toEqualData(mockFeature);
    }));

    describe('$scope.create()', function () {
      var sampleFeaturePostData;

      beforeEach(function () {
        // Create a sample feature object
        sampleFeaturePostData = new Features({
          title: 'An Feature about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Feature about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Features) {
        // Set POST response
        $httpBackend.expectPOST('api/features', sampleFeaturePostData).respond(mockFeature);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the feature was created
        expect($location.path.calls.mostRecent().args[0]).toBe('features/' + mockFeature._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/features', sampleFeaturePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock feature in scope
        scope.feature = mockFeature;
      });

      it('should update a valid feature', inject(function (Features) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/features\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/features/' + mockFeature._id);
      }));

      it('should set scope.error to error response message', inject(function (Features) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/features\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(feature)', function () {
      beforeEach(function () {
        // Create new features array and include the feature
        scope.features = [mockFeature, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/features\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockFeature);
      });

      it('should send a DELETE request with a valid featureId and remove the feature from the scope', inject(function (Features) {
        expect(scope.features.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.feature = mockFeature;

        $httpBackend.expectDELETE(/api\/features\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to features', function () {
        expect($location.path).toHaveBeenCalledWith('features');
      });
    });
  });
}());
