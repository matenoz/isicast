'use strict';

describe('Internships E2E Tests:', function () {
  describe('Test internships page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/internships');
      expect(element.all(by.repeater('internship in internships')).count()).toEqual(0);
    });
  });
});
