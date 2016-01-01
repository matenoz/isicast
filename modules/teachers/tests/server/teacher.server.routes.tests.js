'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Teacher = mongoose.model('Teacher'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, teacher;

/**
 * Teacher routes tests
 */
describe('Teacher CRUD tests', function () {

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

    // Save a user to the test db and create new teacher
    user.save(function () {
      teacher = {
        title: 'Teacher Title',
        content: 'Teacher Content'
      };

      done();
    });
  });

  it('should be able to save an teacher if logged in', function (done) {
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

        // Save a new teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Get a list of teachers
            agent.get('/api/teachers')
              .end(function (teachersGetErr, teachersGetRes) {
                // Handle teacher save error
                if (teachersGetErr) {
                  return done(teachersGetErr);
                }

                // Get teachers list
                var teachers = teachersGetRes.body;

                // Set assertions
                (teachers[0].user._id).should.equal(userId);
                (teachers[0].title).should.match('Teacher Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an teacher if not logged in', function (done) {
    agent.post('/api/teachers')
      .send(teacher)
      .expect(403)
      .end(function (teacherSaveErr, teacherSaveRes) {
        // Call the assertion callback
        done(teacherSaveErr);
      });
  });

  it('should not be able to save an teacher if no title is provided', function (done) {
    // Invalidate title field
    teacher.title = '';

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

        // Save a new teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(400)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Set message assertion
            (teacherSaveRes.body.message).should.match('Title cannot be blank');

            // Handle teacher save error
            done(teacherSaveErr);
          });
      });
  });

  it('should be able to update an teacher if signed in', function (done) {
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

        // Save a new teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Update teacher title
            teacher.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing teacher
            agent.put('/api/teachers/' + teacherSaveRes.body._id)
              .send(teacher)
              .expect(200)
              .end(function (teacherUpdateErr, teacherUpdateRes) {
                // Handle teacher update error
                if (teacherUpdateErr) {
                  return done(teacherUpdateErr);
                }

                // Set assertions
                (teacherUpdateRes.body._id).should.equal(teacherSaveRes.body._id);
                (teacherUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of teachers if not signed in', function (done) {
    // Create new teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the teacher
    teacherObj.save(function () {
      // Request teachers
      request(app).get('/api/teachers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single teacher if not signed in', function (done) {
    // Create new teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the teacher
    teacherObj.save(function () {
      request(app).get('/api/teachers/' + teacherObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', teacher.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single teacher with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/teachers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Teacher is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single teacher which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent teacher
    request(app).get('/api/teachers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No teacher with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an teacher if signed in', function (done) {
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

        // Save a new teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Delete an existing teacher
            agent.delete('/api/teachers/' + teacherSaveRes.body._id)
              .send(teacher)
              .expect(200)
              .end(function (teacherDeleteErr, teacherDeleteRes) {
                // Handle teacher error error
                if (teacherDeleteErr) {
                  return done(teacherDeleteErr);
                }

                // Set assertions
                (teacherDeleteRes.body._id).should.equal(teacherSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an teacher if not signed in', function (done) {
    // Set teacher user
    teacher.user = user;

    // Create new teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the teacher
    teacherObj.save(function () {
      // Try deleting teacher
      request(app).delete('/api/teachers/' + teacherObj._id)
        .expect(403)
        .end(function (teacherDeleteErr, teacherDeleteRes) {
          // Set message assertion
          (teacherDeleteRes.body.message).should.match('User is not authorized');

          // Handle teacher error error
          done(teacherDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Teacher.remove().exec(done);
    });
  });
});
