'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Deadline = mongoose.model('Deadline'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, deadline;

/**
 * Deadline routes tests
 */
describe('Deadline CRUD tests', function () {

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

    // Save a user to the test db and create new deadline
    user.save(function () {
      deadline = {
        title: 'Deadline Title',
        content: 'Deadline Content'
      };

      done();
    });
  });

  it('should be able to save an deadline if logged in', function (done) {
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

        // Save a new deadline
        agent.post('/api/deadlines')
          .send(deadline)
          .expect(200)
          .end(function (deadlineSaveErr, deadlineSaveRes) {
            // Handle deadline save error
            if (deadlineSaveErr) {
              return done(deadlineSaveErr);
            }

            // Get a list of deadlines
            agent.get('/api/deadlines')
              .end(function (deadlinesGetErr, deadlinesGetRes) {
                // Handle deadline save error
                if (deadlinesGetErr) {
                  return done(deadlinesGetErr);
                }

                // Get deadlines list
                var deadlines = deadlinesGetRes.body;

                // Set assertions
                (deadlines[0].user._id).should.equal(userId);
                (deadlines[0].title).should.match('Deadline Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an deadline if not logged in', function (done) {
    agent.post('/api/deadlines')
      .send(deadline)
      .expect(403)
      .end(function (deadlineSaveErr, deadlineSaveRes) {
        // Call the assertion callback
        done(deadlineSaveErr);
      });
  });

  it('should not be able to save an deadline if no title is provided', function (done) {
    // Invalidate title field
    deadline.title = '';

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

        // Save a new deadline
        agent.post('/api/deadlines')
          .send(deadline)
          .expect(400)
          .end(function (deadlineSaveErr, deadlineSaveRes) {
            // Set message assertion
            (deadlineSaveRes.body.message).should.match('Title cannot be blank');

            // Handle deadline save error
            done(deadlineSaveErr);
          });
      });
  });

  it('should be able to update an deadline if signed in', function (done) {
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

        // Save a new deadline
        agent.post('/api/deadlines')
          .send(deadline)
          .expect(200)
          .end(function (deadlineSaveErr, deadlineSaveRes) {
            // Handle deadline save error
            if (deadlineSaveErr) {
              return done(deadlineSaveErr);
            }

            // Update deadline title
            deadline.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing deadline
            agent.put('/api/deadlines/' + deadlineSaveRes.body._id)
              .send(deadline)
              .expect(200)
              .end(function (deadlineUpdateErr, deadlineUpdateRes) {
                // Handle deadline update error
                if (deadlineUpdateErr) {
                  return done(deadlineUpdateErr);
                }

                // Set assertions
                (deadlineUpdateRes.body._id).should.equal(deadlineSaveRes.body._id);
                (deadlineUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of deadlines if not signed in', function (done) {
    // Create new deadline model instance
    var deadlineObj = new Deadline(deadline);

    // Save the deadline
    deadlineObj.save(function () {
      // Request deadlines
      request(app).get('/api/deadlines')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single deadline if not signed in', function (done) {
    // Create new deadline model instance
    var deadlineObj = new Deadline(deadline);

    // Save the deadline
    deadlineObj.save(function () {
      request(app).get('/api/deadlines/' + deadlineObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', deadline.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single deadline with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/deadlines/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Deadline is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single deadline which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent deadline
    request(app).get('/api/deadlines/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No deadline with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an deadline if signed in', function (done) {
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

        // Save a new deadline
        agent.post('/api/deadlines')
          .send(deadline)
          .expect(200)
          .end(function (deadlineSaveErr, deadlineSaveRes) {
            // Handle deadline save error
            if (deadlineSaveErr) {
              return done(deadlineSaveErr);
            }

            // Delete an existing deadline
            agent.delete('/api/deadlines/' + deadlineSaveRes.body._id)
              .send(deadline)
              .expect(200)
              .end(function (deadlineDeleteErr, deadlineDeleteRes) {
                // Handle deadline error error
                if (deadlineDeleteErr) {
                  return done(deadlineDeleteErr);
                }

                // Set assertions
                (deadlineDeleteRes.body._id).should.equal(deadlineSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an deadline if not signed in', function (done) {
    // Set deadline user
    deadline.user = user;

    // Create new deadline model instance
    var deadlineObj = new Deadline(deadline);

    // Save the deadline
    deadlineObj.save(function () {
      // Try deleting deadline
      request(app).delete('/api/deadlines/' + deadlineObj._id)
        .expect(403)
        .end(function (deadlineDeleteErr, deadlineDeleteRes) {
          // Set message assertion
          (deadlineDeleteRes.body.message).should.match('User is not authorized');

          // Handle deadline error error
          done(deadlineDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Deadline.remove().exec(done);
    });
  });
});
