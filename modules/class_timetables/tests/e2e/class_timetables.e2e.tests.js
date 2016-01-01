'use strict';

describe('Class_timetables E2E Tests:', function () {
  describe('Test class_timetables page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/class_timetables');
      expect(element.all(by.repeater('class_timetable in class_timetables')).count()).toEqual(0);
    });
  });
});
