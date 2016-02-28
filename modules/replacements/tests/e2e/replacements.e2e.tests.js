'use strict';

describe('Replacements E2E Tests:', function () {
  describe('Test replacements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/replacements');
      expect(element.all(by.repeater('replacement in replacements')).count()).toEqual(0);
    });
  });
});
