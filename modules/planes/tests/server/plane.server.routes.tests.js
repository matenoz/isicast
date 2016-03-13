'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plane = mongoose.model('Plane'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, plane;

/**
 * Plane routes tests
 */
describe('Plane CRUD tests', function () {

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

    // Save a user to the test db and create new plane
    user.save(function () {
      plane = {
        title: 'Plane Title',
        content: 'Plane Content'
      };

      done();
    });
  });

  it('should be able to save an plane if logged in', function (done) {
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

        // Save a new plane
        agent.post('/api/planes')
          .send(plane)
          .expect(200)
          .end(function (planeSaveErr, planeSaveRes) {
            // Handle plane save error
            if (planeSaveErr) {
              return done(planeSaveErr);
            }

            // Get a list of planes
            agent.get('/api/planes')
              .end(function (planesGetErr, planesGetRes) {
                // Handle plane save error
                if (planesGetErr) {
                  return done(planesGetErr);
                }

                // Get planes list
                var planes = planesGetRes.body;

                // Set assertions
                (planes[0].user._id).should.equal(userId);
                (planes[0].title).should.match('Plane Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an plane if not logged in', function (done) {
    agent.post('/api/planes')
      .send(plane)
      .expect(403)
      .end(function (planeSaveErr, planeSaveRes) {
        // Call the assertion callback
        done(planeSaveErr);
      });
  });

  it('should not be able to save an plane if no title is provided', function (done) {
    // Invalidate title field
    plane.title = '';

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

        // Save a new plane
        agent.post('/api/planes')
          .send(plane)
          .expect(400)
          .end(function (planeSaveErr, planeSaveRes) {
            // Set message assertion
            (planeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle plane save error
            done(planeSaveErr);
          });
      });
  });

  it('should be able to update an plane if signed in', function (done) {
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

        // Save a new plane
        agent.post('/api/planes')
          .send(plane)
          .expect(200)
          .end(function (planeSaveErr, planeSaveRes) {
            // Handle plane save error
            if (planeSaveErr) {
              return done(planeSaveErr);
            }

            // Update plane title
            plane.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing plane
            agent.put('/api/planes/' + planeSaveRes.body._id)
              .send(plane)
              .expect(200)
              .end(function (planeUpdateErr, planeUpdateRes) {
                // Handle plane update error
                if (planeUpdateErr) {
                  return done(planeUpdateErr);
                }

                // Set assertions
                (planeUpdateRes.body._id).should.equal(planeSaveRes.body._id);
                (planeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of planes if not signed in', function (done) {
    // Create new plane model instance
    var planeObj = new Plane(plane);

    // Save the plane
    planeObj.save(function () {
      // Request planes
      request(app).get('/api/planes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single plane if not signed in', function (done) {
    // Create new plane model instance
    var planeObj = new Plane(plane);

    // Save the plane
    planeObj.save(function () {
      request(app).get('/api/planes/' + planeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', plane.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single plane with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/planes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Plane is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single plane which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent plane
    request(app).get('/api/planes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No plane with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an plane if signed in', function (done) {
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

        // Save a new plane
        agent.post('/api/planes')
          .send(plane)
          .expect(200)
          .end(function (planeSaveErr, planeSaveRes) {
            // Handle plane save error
            if (planeSaveErr) {
              return done(planeSaveErr);
            }

            // Delete an existing plane
            agent.delete('/api/planes/' + planeSaveRes.body._id)
              .send(plane)
              .expect(200)
              .end(function (planeDeleteErr, planeDeleteRes) {
                // Handle plane error error
                if (planeDeleteErr) {
                  return done(planeDeleteErr);
                }

                // Set assertions
                (planeDeleteRes.body._id).should.equal(planeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an plane if not signed in', function (done) {
    // Set plane user
    plane.user = user;

    // Create new plane model instance
    var planeObj = new Plane(plane);

    // Save the plane
    planeObj.save(function () {
      // Try deleting plane
      request(app).delete('/api/planes/' + planeObj._id)
        .expect(403)
        .end(function (planeDeleteErr, planeDeleteRes) {
          // Set message assertion
          (planeDeleteRes.body.message).should.match('User is not authorized');

          // Handle plane error error
          done(planeDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Plane.remove().exec(done);
    });
  });
});
