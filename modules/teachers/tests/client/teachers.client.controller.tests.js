'use strict';

(function () {
  // Teachers Controller Spec
  describe('Teachers Controller Tests', function () {
    // Initialize global variables
    var TeachersController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Teachers,
      mockTeacher;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Teachers_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Teachers = _Teachers_;

      // create mock teacher
      mockTeacher = new Teachers({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Teacher about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Teachers controller.
      TeachersController = $controller('TeachersController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one teacher object fetched from XHR', inject(function (Teachers) {
      // Create a sample teachers array that includes the new teacher
      var sampleTeachers = [mockTeacher];

      // Set GET response
      $httpBackend.expectGET('api/teachers').respond(sampleTeachers);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.teachers).toEqualData(sampleTeachers);
    }));

    it('$scope.findOne() should create an array with one teacher object fetched from XHR using a teacherId URL parameter', inject(function (Teachers) {
      // Set the URL parameter
      $stateParams.teacherId = mockTeacher._id;

      // Set GET response
      $httpBackend.expectGET(/api\/teachers\/([0-9a-fA-F]{24})$/).respond(mockTeacher);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.teacher).toEqualData(mockTeacher);
    }));

    describe('$scope.create()', function () {
      var sampleTeacherPostData;

      beforeEach(function () {
        // Create a sample teacher object
        sampleTeacherPostData = new Teachers({
          title: 'An Teacher about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Teacher about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Teachers) {
        // Set POST response
        $httpBackend.expectPOST('api/teachers', sampleTeacherPostData).respond(mockTeacher);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the teacher was created
        expect($location.path.calls.mostRecent().args[0]).toBe('teachers/' + mockTeacher._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/teachers', sampleTeacherPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock teacher in scope
        scope.teacher = mockTeacher;
      });

      it('should update a valid teacher', inject(function (Teachers) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/teachers\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/teachers/' + mockTeacher._id);
      }));

      it('should set scope.error to error response message', inject(function (Teachers) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/teachers\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(teacher)', function () {
      beforeEach(function () {
        // Create new teachers array and include the teacher
        scope.teachers = [mockTeacher, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/teachers\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockTeacher);
      });

      it('should send a DELETE request with a valid teacherId and remove the teacher from the scope', inject(function (Teachers) {
        expect(scope.teachers.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.teacher = mockTeacher;

        $httpBackend.expectDELETE(/api\/teachers\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to teachers', function () {
        expect($location.path).toHaveBeenCalledWith('teachers');
      });
    });
  });
}());
