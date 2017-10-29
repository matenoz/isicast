'use strict';

(function () {
  // Internships Controller Spec
  describe('Internships Controller Tests', function () {
    // Initialize global variables
    var InternshipsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Internships,
      mockInternship;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Internships_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Internships = _Internships_;

      // create mock internship
      mockInternship = new Internships({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Internship about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Internships controller.
      InternshipsController = $controller('InternshipsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one internship object fetched from XHR', inject(function (Internships) {
      // Create a sample internships array that includes the new internship
      var sampleInternships = [mockInternship];

      // Set GET response
      $httpBackend.expectGET('api/internships').respond(sampleInternships);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.internships).toEqualData(sampleInternships);
    }));

    it('$scope.findOne() should create an array with one internship object fetched from XHR using a internshipId URL parameter', inject(function (Internships) {
      // Set the URL parameter
      $stateParams.internshipId = mockInternship._id;

      // Set GET response
      $httpBackend.expectGET(/api\/internships\/([0-9a-fA-F]{24})$/).respond(mockInternship);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.internship).toEqualData(mockInternship);
    }));

    describe('$scope.create()', function () {
      var sampleInternshipPostData;

      beforeEach(function () {
        // Create a sample internship object
        sampleInternshipPostData = new Internships({
          title: 'An Internship about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Internship about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Internships) {
        // Set POST response
        $httpBackend.expectPOST('api/internships', sampleInternshipPostData).respond(mockInternship);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the internship was created
        expect($location.path.calls.mostRecent().args[0]).toBe('internships/' + mockInternship._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/internships', sampleInternshipPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock internship in scope
        scope.internship = mockInternship;
      });

      it('should update a valid internship', inject(function (Internships) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/internships\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/internships/' + mockInternship._id);
      }));

      it('should set scope.error to error response message', inject(function (Internships) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/internships\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(internship)', function () {
      beforeEach(function () {
        // Create new internships array and include the internship
        scope.internships = [mockInternship, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/internships\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockInternship);
      });

      it('should send a DELETE request with a valid internshipId and remove the internship from the scope', inject(function (Internships) {
        expect(scope.internships.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.internship = mockInternship;

        $httpBackend.expectDELETE(/api\/internships\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to internships', function () {
        expect($location.path).toHaveBeenCalledWith('internships');
      });
    });
  });
}());
