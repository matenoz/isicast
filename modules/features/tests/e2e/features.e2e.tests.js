'use strict';

describe('Features E2E Tests:', function () {
  describe('Test features page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/features');
      expect(element.all(by.repeater('feature in features')).count()).toEqual(0);
    });
  });
});
