'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userdoc = mongoose.model('Userdoc');

/**
 * Globals
 */
var user, userdoc;

/**
 * Unit tests
 */
describe('Userdoc Model Unit Tests:', function () {

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
      userdoc = new Userdoc({
        title: 'Userdoc Title',
        content: 'Userdoc Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return userdoc.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      userdoc.title = '';

      return userdoc.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Userdoc.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
