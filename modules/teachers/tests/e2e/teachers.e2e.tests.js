'use strict';

describe('Teachers E2E Tests:', function () {
  describe('Test teachers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/teachers');
      expect(element.all(by.repeater('teacher in teachers')).count()).toEqual(0);
    });
  });
});
