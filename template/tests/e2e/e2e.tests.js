'use strict';

describe('Classes E2E Tests:', function () {
  describe('Test classes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/classes');
      expect(element.all(by.repeater('classe in classes')).count()).toEqual(0);
    });
  });
});
