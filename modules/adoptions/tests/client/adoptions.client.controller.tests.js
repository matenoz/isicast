'use strict';

(function () {
  // Adoptions Controller Spec
  describe('Adoptions Controller Tests', function () {
    // Initialize global variables
    var AdoptionsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Adoptions,
      mockAdoption;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Adoptions_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Adoptions = _Adoptions_;

      // create mock adoption
      mockAdoption = new Adoptions({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Adoption about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Adoptions controller.
      AdoptionsController = $controller('AdoptionsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one adoption object fetched from XHR', inject(function (Adoptions) {
      // Create a sample adoptions array that includes the new adoption
      var sampleAdoptions = [mockAdoption];

      // Set GET response
      $httpBackend.expectGET('api/adoptions').respond(sampleAdoptions);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.adoptions).toEqualData(sampleAdoptions);
    }));

    it('$scope.findOne() should create an array with one adoption object fetched from XHR using a adoptionId URL parameter', inject(function (Adoptions) {
      // Set the URL parameter
      $stateParams.adoptionId = mockAdoption._id;

      // Set GET response
      $httpBackend.expectGET(/api\/adoptions\/([0-9a-fA-F]{24})$/).respond(mockAdoption);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.adoption).toEqualData(mockAdoption);
    }));

    describe('$scope.create()', function () {
      var sampleAdoptionPostData;

      beforeEach(function () {
        // Create a sample adoption object
        sampleAdoptionPostData = new Adoptions({
          title: 'An Adoption about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Adoption about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Adoptions) {
        // Set POST response
        $httpBackend.expectPOST('api/adoptions', sampleAdoptionPostData).respond(mockAdoption);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the adoption was created
        expect($location.path.calls.mostRecent().args[0]).toBe('adoptions/' + mockAdoption._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/adoptions', sampleAdoptionPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock adoption in scope
        scope.adoption = mockAdoption;
      });

      it('should update a valid adoption', inject(function (Adoptions) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/adoptions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/adoptions/' + mockAdoption._id);
      }));

      it('should set scope.error to error response message', inject(function (Adoptions) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/adoptions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(adoption)', function () {
      beforeEach(function () {
        // Create new adoptions array and include the adoption
        scope.adoptions = [mockAdoption, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/adoptions\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockAdoption);
      });

      it('should send a DELETE request with a valid adoptionId and remove the adoption from the scope', inject(function (Adoptions) {
        expect(scope.adoptions.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.adoption = mockAdoption;

        $httpBackend.expectDELETE(/api\/adoptions\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to adoptions', function () {
        expect($location.path).toHaveBeenCalledWith('adoptions');
      });
    });
  });
}());
