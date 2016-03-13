'use strict';

(function () {
  // Rules Controller Spec
  describe('Rules Controller Tests', function () {
    // Initialize global variables
    var RulesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Rules,
      mockRule;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Rules_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Rules = _Rules_;

      // create mock rule
      mockRule = new Rules({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Rule about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Rules controller.
      RulesController = $controller('RulesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one rule object fetched from XHR', inject(function (Rules) {
      // Create a sample rules array that includes the new rule
      var sampleRules = [mockRule];

      // Set GET response
      $httpBackend.expectGET('api/rules').respond(sampleRules);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.rules).toEqualData(sampleRules);
    }));

    it('$scope.findOne() should create an array with one rule object fetched from XHR using a ruleId URL parameter', inject(function (Rules) {
      // Set the URL parameter
      $stateParams.ruleId = mockRule._id;

      // Set GET response
      $httpBackend.expectGET(/api\/rules\/([0-9a-fA-F]{24})$/).respond(mockRule);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.rule).toEqualData(mockRule);
    }));

    describe('$scope.create()', function () {
      var sampleRulePostData;

      beforeEach(function () {
        // Create a sample rule object
        sampleRulePostData = new Rules({
          title: 'An Rule about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Rule about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Rules) {
        // Set POST response
        $httpBackend.expectPOST('api/rules', sampleRulePostData).respond(mockRule);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the rule was created
        expect($location.path.calls.mostRecent().args[0]).toBe('rules/' + mockRule._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/rules', sampleRulePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock rule in scope
        scope.rule = mockRule;
      });

      it('should update a valid rule', inject(function (Rules) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/rules\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/rules/' + mockRule._id);
      }));

      it('should set scope.error to error response message', inject(function (Rules) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/rules\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(rule)', function () {
      beforeEach(function () {
        // Create new rules array and include the rule
        scope.rules = [mockRule, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/rules\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRule);
      });

      it('should send a DELETE request with a valid ruleId and remove the rule from the scope', inject(function (Rules) {
        expect(scope.rules.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.rule = mockRule;

        $httpBackend.expectDELETE(/api\/rules\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to rules', function () {
        expect($location.path).toHaveBeenCalledWith('rules');
      });
    });
  });
}());
