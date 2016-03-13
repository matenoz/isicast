'use strict';

(function () {
  // Planes Controller Spec
  describe('Planes Controller Tests', function () {
    // Initialize global variables
    var PlanesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Planes,
      mockPlane;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Planes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Planes = _Planes_;

      // create mock plane
      mockPlane = new Planes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Plane about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Planes controller.
      PlanesController = $controller('PlanesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one plane object fetched from XHR', inject(function (Planes) {
      // Create a sample planes array that includes the new plane
      var samplePlanes = [mockPlane];

      // Set GET response
      $httpBackend.expectGET('api/planes').respond(samplePlanes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.planes).toEqualData(samplePlanes);
    }));

    it('$scope.findOne() should create an array with one plane object fetched from XHR using a planeId URL parameter', inject(function (Planes) {
      // Set the URL parameter
      $stateParams.planeId = mockPlane._id;

      // Set GET response
      $httpBackend.expectGET(/api\/planes\/([0-9a-fA-F]{24})$/).respond(mockPlane);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.plane).toEqualData(mockPlane);
    }));

    describe('$scope.create()', function () {
      var samplePlanePostData;

      beforeEach(function () {
        // Create a sample plane object
        samplePlanePostData = new Planes({
          title: 'An Plane about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Plane about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Planes) {
        // Set POST response
        $httpBackend.expectPOST('api/planes', samplePlanePostData).respond(mockPlane);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the plane was created
        expect($location.path.calls.mostRecent().args[0]).toBe('planes/' + mockPlane._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/planes', samplePlanePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock plane in scope
        scope.plane = mockPlane;
      });

      it('should update a valid plane', inject(function (Planes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/planes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/planes/' + mockPlane._id);
      }));

      it('should set scope.error to error response message', inject(function (Planes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/planes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(plane)', function () {
      beforeEach(function () {
        // Create new planes array and include the plane
        scope.planes = [mockPlane, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/planes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockPlane);
      });

      it('should send a DELETE request with a valid planeId and remove the plane from the scope', inject(function (Planes) {
        expect(scope.planes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.plane = mockPlane;

        $httpBackend.expectDELETE(/api\/planes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to planes', function () {
        expect($location.path).toHaveBeenCalledWith('planes');
      });
    });
  });
}());
