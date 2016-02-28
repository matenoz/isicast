'use strict';

(function () {
  // Replacements Controller Spec
  describe('Replacements Controller Tests', function () {
    // Initialize global variables
    var ReplacementsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Replacements,
      mockReplacement;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Replacements_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Replacements = _Replacements_;

      // create mock replacement
      mockReplacement = new Replacements({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Replacement about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Replacements controller.
      ReplacementsController = $controller('ReplacementsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one replacement object fetched from XHR', inject(function (Replacements) {
      // Create a sample replacements array that includes the new replacement
      var sampleReplacements = [mockReplacement];

      // Set GET response
      $httpBackend.expectGET('api/replacements').respond(sampleReplacements);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.replacements).toEqualData(sampleReplacements);
    }));

    it('$scope.findOne() should create an array with one replacement object fetched from XHR using a replacementId URL parameter', inject(function (Replacements) {
      // Set the URL parameter
      $stateParams.replacementId = mockReplacement._id;

      // Set GET response
      $httpBackend.expectGET(/api\/replacements\/([0-9a-fA-F]{24})$/).respond(mockReplacement);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.replacement).toEqualData(mockReplacement);
    }));

    describe('$scope.create()', function () {
      var sampleReplacementPostData;

      beforeEach(function () {
        // Create a sample replacement object
        sampleReplacementPostData = new Replacements({
          title: 'An Replacement about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Replacement about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Replacements) {
        // Set POST response
        $httpBackend.expectPOST('api/replacements', sampleReplacementPostData).respond(mockReplacement);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the replacement was created
        expect($location.path.calls.mostRecent().args[0]).toBe('replacements/' + mockReplacement._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/replacements', sampleReplacementPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock replacement in scope
        scope.replacement = mockReplacement;
      });

      it('should update a valid replacement', inject(function (Replacements) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/replacements\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/replacements/' + mockReplacement._id);
      }));

      it('should set scope.error to error response message', inject(function (Replacements) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/replacements\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(replacement)', function () {
      beforeEach(function () {
        // Create new replacements array and include the replacement
        scope.replacements = [mockReplacement, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/replacements\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockReplacement);
      });

      it('should send a DELETE request with a valid replacementId and remove the replacement from the scope', inject(function (Replacements) {
        expect(scope.replacements.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.replacement = mockReplacement;

        $httpBackend.expectDELETE(/api\/replacements\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to replacements', function () {
        expect($location.path).toHaveBeenCalledWith('replacements');
      });
    });
  });
}());
