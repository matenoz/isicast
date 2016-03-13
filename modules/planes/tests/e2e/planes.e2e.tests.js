'use strict';

describe('Planes E2E Tests:', function () {
  describe('Test planes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/planes');
      expect(element.all(by.repeater('plane in planes')).count()).toEqual(0);
    });
  });
});
