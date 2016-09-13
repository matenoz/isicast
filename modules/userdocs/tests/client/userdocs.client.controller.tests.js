'use strict';

(function () {
  // Userdocs Controller Spec
  describe('Userdocs Controller Tests', function () {
    // Initialize global variables
    var UserdocsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Userdocs,
      mockUserdoc;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Userdocs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Userdocs = _Userdocs_;

      // create mock userdoc
      mockUserdoc = new Userdocs({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Userdoc about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Userdocs controller.
      UserdocsController = $controller('UserdocsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one userdoc object fetched from XHR', inject(function (Userdocs) {
      // Create a sample userdocs array that includes the new userdoc
      var sampleUserdocs = [mockUserdoc];

      // Set GET response
      $httpBackend.expectGET('api/userdocs').respond(sampleUserdocs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.userdocs).toEqualData(sampleUserdocs);
    }));

    it('$scope.findOne() should create an array with one userdoc object fetched from XHR using a userdocId URL parameter', inject(function (Userdocs) {
      // Set the URL parameter
      $stateParams.userdocId = mockUserdoc._id;

      // Set GET response
      $httpBackend.expectGET(/api\/userdocs\/([0-9a-fA-F]{24})$/).respond(mockUserdoc);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.userdoc).toEqualData(mockUserdoc);
    }));

    describe('$scope.create()', function () {
      var sampleUserdocPostData;

      beforeEach(function () {
        // Create a sample userdoc object
        sampleUserdocPostData = new Userdocs({
          title: 'An Userdoc about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Userdoc about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Userdocs) {
        // Set POST response
        $httpBackend.expectPOST('api/userdocs', sampleUserdocPostData).respond(mockUserdoc);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the userdoc was created
        expect($location.path.calls.mostRecent().args[0]).toBe('userdocs/' + mockUserdoc._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/userdocs', sampleUserdocPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock userdoc in scope
        scope.userdoc = mockUserdoc;
      });

      it('should update a valid userdoc', inject(function (Userdocs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/userdocs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/userdocs/' + mockUserdoc._id);
      }));

      it('should set scope.error to error response message', inject(function (Userdocs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/userdocs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(userdoc)', function () {
      beforeEach(function () {
        // Create new userdocs array and include the userdoc
        scope.userdocs = [mockUserdoc, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/userdocs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockUserdoc);
      });

      it('should send a DELETE request with a valid userdocId and remove the userdoc from the scope', inject(function (Userdocs) {
        expect(scope.userdocs.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.userdoc = mockUserdoc;

        $httpBackend.expectDELETE(/api\/userdocs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to userdocs', function () {
        expect($location.path).toHaveBeenCalledWith('userdocs');
      });
    });
  });
}());
