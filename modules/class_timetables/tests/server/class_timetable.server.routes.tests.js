'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Class_timetable = mongoose.model('Class_timetable'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, class_timetable;

/**
 * Class_timetable routes tests
 */
describe('Class_timetable CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new class_timetable
    user.save(function () {
      class_timetable = {
        title: 'Class_timetable Title',
        content: 'Class_timetable Content'
      };

      done();
    });
  });

  it('should be able to save an class_timetable if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new class_timetable
        agent.post('/api/class_timetables')
          .send(class_timetable)
          .expect(200)
          .end(function (class_timetableSaveErr, class_timetableSaveRes) {
            // Handle class_timetable save error
            if (class_timetableSaveErr) {
              return done(class_timetableSaveErr);
            }

            // Get a list of class_timetables
            agent.get('/api/class_timetables')
              .end(function (class_timetablesGetErr, class_timetablesGetRes) {
                // Handle class_timetable save error
                if (class_timetablesGetErr) {
                  return done(class_timetablesGetErr);
                }

                // Get class_timetables list
                var class_timetables = class_timetablesGetRes.body;

                // Set assertions
                (class_timetables[0].user._id).should.equal(userId);
                (class_timetables[0].title).should.match('Class_timetable Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an class_timetable if not logged in', function (done) {
    agent.post('/api/class_timetables')
      .send(class_timetable)
      .expect(403)
      .end(function (class_timetableSaveErr, class_timetableSaveRes) {
        // Call the assertion callback
        done(class_timetableSaveErr);
      });
  });

  it('should not be able to save an class_timetable if no title is provided', function (done) {
    // Invalidate title field
    class_timetable.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new class_timetable
        agent.post('/api/class_timetables')
          .send(class_timetable)
          .expect(400)
          .end(function (class_timetableSaveErr, class_timetableSaveRes) {
            // Set message assertion
            (class_timetableSaveRes.body.message).should.match('Title cannot be blank');

            // Handle class_timetable save error
            done(class_timetableSaveErr);
          });
      });
  });

  it('should be able to update an class_timetable if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new class_timetable
        agent.post('/api/class_timetables')
          .send(class_timetable)
          .expect(200)
          .end(function (class_timetableSaveErr, class_timetableSaveRes) {
            // Handle class_timetable save error
            if (class_timetableSaveErr) {
              return done(class_timetableSaveErr);
            }

            // Update class_timetable title
            class_timetable.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing class_timetable
            agent.put('/api/class_timetables/' + class_timetableSaveRes.body._id)
              .send(class_timetable)
              .expect(200)
              .end(function (class_timetableUpdateErr, class_timetableUpdateRes) {
                // Handle class_timetable update error
                if (class_timetableUpdateErr) {
                  return done(class_timetableUpdateErr);
                }

                // Set assertions
                (class_timetableUpdateRes.body._id).should.equal(class_timetableSaveRes.body._id);
                (class_timetableUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of class_timetables if not signed in', function (done) {
    // Create new class_timetable model instance
    var class_timetableObj = new Class_timetable(class_timetable);

    // Save the class_timetable
    class_timetableObj.save(function () {
      // Request class_timetables
      request(app).get('/api/class_timetables')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single class_timetable if not signed in', function (done) {
    // Create new class_timetable model instance
    var class_timetableObj = new Class_timetable(class_timetable);

    // Save the class_timetable
    class_timetableObj.save(function () {
      request(app).get('/api/class_timetables/' + class_timetableObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', class_timetable.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single class_timetable with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/class_timetables/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Class_timetable is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single class_timetable which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent class_timetable
    request(app).get('/api/class_timetables/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No class_timetable with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an class_timetable if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new class_timetable
        agent.post('/api/class_timetables')
          .send(class_timetable)
          .expect(200)
          .end(function (class_timetableSaveErr, class_timetableSaveRes) {
            // Handle class_timetable save error
            if (class_timetableSaveErr) {
              return done(class_timetableSaveErr);
            }

            // Delete an existing class_timetable
            agent.delete('/api/class_timetables/' + class_timetableSaveRes.body._id)
              .send(class_timetable)
              .expect(200)
              .end(function (class_timetableDeleteErr, class_timetableDeleteRes) {
                // Handle class_timetable error error
                if (class_timetableDeleteErr) {
                  return done(class_timetableDeleteErr);
                }

                // Set assertions
                (class_timetableDeleteRes.body._id).should.equal(class_timetableSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an class_timetable if not signed in', function (done) {
    // Set class_timetable user
    class_timetable.user = user;

    // Create new class_timetable model instance
    var class_timetableObj = new Class_timetable(class_timetable);

    // Save the class_timetable
    class_timetableObj.save(function () {
      // Try deleting class_timetable
      request(app).delete('/api/class_timetables/' + class_timetableObj._id)
        .expect(403)
        .end(function (class_timetableDeleteErr, class_timetableDeleteRes) {
          // Set message assertion
          (class_timetableDeleteRes.body.message).should.match('User is not authorized');

          // Handle class_timetable error error
          done(class_timetableDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Class_timetable.remove().exec(done);
    });
  });
});
