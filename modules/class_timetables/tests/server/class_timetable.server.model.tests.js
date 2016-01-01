'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Class_timetable = mongoose.model('Class_timetable');

/**
 * Globals
 */
var user, class_timetable;

/**
 * Unit tests
 */
describe('Class_timetable Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      class_timetable = new Class_timetable({
        title: 'Class_timetable Title',
        content: 'Class_timetable Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return class_timetable.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      class_timetable.title = '';

      return class_timetable.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Class_timetable.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
