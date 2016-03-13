'use strict';

describe('Rules E2E Tests:', function () {
  describe('Test rules page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/rules');
      expect(element.all(by.repeater('rule in rules')).count()).toEqual(0);
    });
  });
});
