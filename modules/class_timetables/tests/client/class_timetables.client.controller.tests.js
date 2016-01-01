'use strict';

(function () {
  // Class_timetables Controller Spec
  describe('Class_timetables Controller Tests', function () {
    // Initialize global variables
    var Class_timetablesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Class_timetables,
      mockClass_timetable;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Class_timetables_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Class_timetables = _Class_timetables_;

      // create mock class_timetable
      mockClass_timetable = new Class_timetables({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Class_timetable about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Class_timetables controller.
      Class_timetablesController = $controller('Class_timetablesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one class_timetable object fetched from XHR', inject(function (Class_timetables) {
      // Create a sample class_timetables array that includes the new class_timetable
      var sampleClass_timetables = [mockClass_timetable];

      // Set GET response
      $httpBackend.expectGET('api/class_timetables').respond(sampleClass_timetables);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.class_timetables).toEqualData(sampleClass_timetables);
    }));

    it('$scope.findOne() should create an array with one class_timetable object fetched from XHR using a class_timetableId URL parameter', inject(function (Class_timetables) {
      // Set the URL parameter
      $stateParams.class_timetableId = mockClass_timetable._id;

      // Set GET response
      $httpBackend.expectGET(/api\/class_timetables\/([0-9a-fA-F]{24})$/).respond(mockClass_timetable);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.class_timetable).toEqualData(mockClass_timetable);
    }));

    describe('$scope.create()', function () {
      var sampleClass_timetablePostData;

      beforeEach(function () {
        // Create a sample class_timetable object
        sampleClass_timetablePostData = new Class_timetables({
          title: 'An Class_timetable about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Class_timetable about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Class_timetables) {
        // Set POST response
        $httpBackend.expectPOST('api/class_timetables', sampleClass_timetablePostData).respond(mockClass_timetable);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the class_timetable was created
        expect($location.path.calls.mostRecent().args[0]).toBe('class_timetables/' + mockClass_timetable._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/class_timetables', sampleClass_timetablePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock class_timetable in scope
        scope.class_timetable = mockClass_timetable;
      });

      it('should update a valid class_timetable', inject(function (Class_timetables) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/class_timetables\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/class_timetables/' + mockClass_timetable._id);
      }));

      it('should set scope.error to error response message', inject(function (Class_timetables) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/class_timetables\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(class_timetable)', function () {
      beforeEach(function () {
        // Create new class_timetables array and include the class_timetable
        scope.class_timetables = [mockClass_timetable, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/class_timetables\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockClass_timetable);
      });

      it('should send a DELETE request with a valid class_timetableId and remove the class_timetable from the scope', inject(function (Class_timetables) {
        expect(scope.class_timetables.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.class_timetable = mockClass_timetable;

        $httpBackend.expectDELETE(/api\/class_timetables\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to class_timetables', function () {
        expect($location.path).toHaveBeenCalledWith('class_timetables');
      });
    });
  });
}());
