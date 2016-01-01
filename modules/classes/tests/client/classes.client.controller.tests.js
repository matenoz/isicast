'use strict';

(function () {
  // Classes Controller Spec
  describe('Classes Controller Tests', function () {
    // Initialize global variables
    var ClassesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Classes,
      mockClasse;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Classes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Classes = _Classes_;

      // create mock classe
      mockClasse = new Classes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Classe about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Classes controller.
      ClassesController = $controller('ClassesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one classe object fetched from XHR', inject(function (Classes) {
      // Create a sample classes array that includes the new classe
      var sampleClasses = [mockClasse];

      // Set GET response
      $httpBackend.expectGET('api/classes').respond(sampleClasses);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.classes).toEqualData(sampleClasses);
    }));

    it('$scope.findOne() should create an array with one classe object fetched from XHR using a classeId URL parameter', inject(function (Classes) {
      // Set the URL parameter
      $stateParams.classeId = mockClasse._id;

      // Set GET response
      $httpBackend.expectGET(/api\/classes\/([0-9a-fA-F]{24})$/).respond(mockClasse);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.classe).toEqualData(mockClasse);
    }));

    describe('$scope.create()', function () {
      var sampleClassePostData;

      beforeEach(function () {
        // Create a sample classe object
        sampleClassePostData = new Classes({
          title: 'An Classe about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Classe about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Classes) {
        // Set POST response
        $httpBackend.expectPOST('api/classes', sampleClassePostData).respond(mockClasse);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the classe was created
        expect($location.path.calls.mostRecent().args[0]).toBe('classes/' + mockClasse._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/classes', sampleClassePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock classe in scope
        scope.classe = mockClasse;
      });

      it('should update a valid classe', inject(function (Classes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/classes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/classes/' + mockClasse._id);
      }));

      it('should set scope.error to error response message', inject(function (Classes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/classes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(classe)', function () {
      beforeEach(function () {
        // Create new classes array and include the classe
        scope.classes = [mockClasse, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/classes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockClasse);
      });

      it('should send a DELETE request with a valid classeId and remove the classe from the scope', inject(function (Classes) {
        expect(scope.classes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.classe = mockClasse;

        $httpBackend.expectDELETE(/api\/classes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to classes', function () {
        expect($location.path).toHaveBeenCalledWith('classes');
      });
    });
  });
}());
