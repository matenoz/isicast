'use strict';

describe('Deadlines E2E Tests:', function () {
  describe('Test deadlines page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/deadlines');
      expect(element.all(by.repeater('deadline in deadlines')).count()).toEqual(0);
    });
  });
});
