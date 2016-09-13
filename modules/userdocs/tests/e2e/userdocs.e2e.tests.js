'use strict';

describe('Userdocs E2E Tests:', function () {
  describe('Test userdocs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userdocs');
      expect(element.all(by.repeater('userdoc in userdocs')).count()).toEqual(0);
    });
  });
});
