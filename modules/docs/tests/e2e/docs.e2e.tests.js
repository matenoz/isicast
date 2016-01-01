'use strict';

describe('Docs E2E Tests:', function () {
  describe('Test docs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/docs');
      expect(element.all(by.repeater('doc in docs')).count()).toEqual(0);
    });
  });
});
