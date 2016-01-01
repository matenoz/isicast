'use strict';

(function () {
  // Docs Controller Spec
  describe('Docs Controller Tests', function () {
    // Initialize global variables
    var DocsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Docs,
      mockDoc;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Docs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Docs = _Docs_;

      // create mock doc
      mockDoc = new Docs({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Doc about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Docs controller.
      DocsController = $controller('DocsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one doc object fetched from XHR', inject(function (Docs) {
      // Create a sample docs array that includes the new doc
      var sampleDocs = [mockDoc];

      // Set GET response
      $httpBackend.expectGET('api/docs').respond(sampleDocs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.docs).toEqualData(sampleDocs);
    }));

    it('$scope.findOne() should create an array with one doc object fetched from XHR using a docId URL parameter', inject(function (Docs) {
      // Set the URL parameter
      $stateParams.docId = mockDoc._id;

      // Set GET response
      $httpBackend.expectGET(/api\/docs\/([0-9a-fA-F]{24})$/).respond(mockDoc);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.doc).toEqualData(mockDoc);
    }));

    describe('$scope.create()', function () {
      var sampleDocPostData;

      beforeEach(function () {
        // Create a sample doc object
        sampleDocPostData = new Docs({
          title: 'An Doc about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Doc about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Docs) {
        // Set POST response
        $httpBackend.expectPOST('api/docs', sampleDocPostData).respond(mockDoc);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the doc was created
        expect($location.path.calls.mostRecent().args[0]).toBe('docs/' + mockDoc._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/docs', sampleDocPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock doc in scope
        scope.doc = mockDoc;
      });

      it('should update a valid doc', inject(function (Docs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/docs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/docs/' + mockDoc._id);
      }));

      it('should set scope.error to error response message', inject(function (Docs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/docs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(doc)', function () {
      beforeEach(function () {
        // Create new docs array and include the doc
        scope.docs = [mockDoc, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/docs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockDoc);
      });

      it('should send a DELETE request with a valid docId and remove the doc from the scope', inject(function (Docs) {
        expect(scope.docs.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.doc = mockDoc;

        $httpBackend.expectDELETE(/api\/docs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to docs', function () {
        expect($location.path).toHaveBeenCalledWith('docs');
      });
    });
  });
}());
