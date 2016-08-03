'use strict';

describe('Adoptions E2E Tests:', function () {
  describe('Test adoptions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adoptions');
      expect(element.all(by.repeater('adoption in adoptions')).count()).toEqual(0);
    });
  });
});
