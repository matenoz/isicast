'use strict';

(function () {
  // Deadlines Controller Spec
  describe('Deadlines Controller Tests', function () {
    // Initialize global variables
    var DeadlinesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Deadlines,
      mockDeadline;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Deadlines_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Deadlines = _Deadlines_;

      // create mock deadline
      mockDeadline = new Deadlines({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Deadline about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Deadlines controller.
      DeadlinesController = $controller('DeadlinesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one deadline object fetched from XHR', inject(function (Deadlines) {
      // Create a sample deadlines array that includes the new deadline
      var sampleDeadlines = [mockDeadline];

      // Set GET response
      $httpBackend.expectGET('api/deadlines').respond(sampleDeadlines);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.deadlines).toEqualData(sampleDeadlines);
    }));

    it('$scope.findOne() should create an array with one deadline object fetched from XHR using a deadlineId URL parameter', inject(function (Deadlines) {
      // Set the URL parameter
      $stateParams.deadlineId = mockDeadline._id;

      // Set GET response
      $httpBackend.expectGET(/api\/deadlines\/([0-9a-fA-F]{24})$/).respond(mockDeadline);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.deadline).toEqualData(mockDeadline);
    }));

    describe('$scope.create()', function () {
      var sampleDeadlinePostData;

      beforeEach(function () {
        // Create a sample deadline object
        sampleDeadlinePostData = new Deadlines({
          title: 'An Deadline about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Deadline about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Deadlines) {
        // Set POST response
        $httpBackend.expectPOST('api/deadlines', sampleDeadlinePostData).respond(mockDeadline);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the deadline was created
        expect($location.path.calls.mostRecent().args[0]).toBe('deadlines/' + mockDeadline._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/deadlines', sampleDeadlinePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock deadline in scope
        scope.deadline = mockDeadline;
      });

      it('should update a valid deadline', inject(function (Deadlines) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/deadlines\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/deadlines/' + mockDeadline._id);
      }));

      it('should set scope.error to error response message', inject(function (Deadlines) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/deadlines\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(deadline)', function () {
      beforeEach(function () {
        // Create new deadlines array and include the deadline
        scope.deadlines = [mockDeadline, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/deadlines\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockDeadline);
      });

      it('should send a DELETE request with a valid deadlineId and remove the deadline from the scope', inject(function (Deadlines) {
        expect(scope.deadlines.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.deadline = mockDeadline;

        $httpBackend.expectDELETE(/api\/deadlines\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to deadlines', function () {
        expect($location.path).toHaveBeenCalledWith('deadlines');
      });
    });
  });
}());
