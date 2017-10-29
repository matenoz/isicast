'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Internship = mongoose.model('Internship'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, internship;

/**
 * Internship routes tests
 */
describe('Internship CRUD tests', function () {

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

    // Save a user to the test db and create new internship
    user.save(function () {
      internship = {
        title: 'Internship Title',
        content: 'Internship Content'
      };

      done();
    });
  });

  it('should be able to save an internship if logged in', function (done) {
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

        // Save a new internship
        agent.post('/api/internships')
          .send(internship)
          .expect(200)
          .end(function (internshipSaveErr, internshipSaveRes) {
            // Handle internship save error
            if (internshipSaveErr) {
              return done(internshipSaveErr);
            }

            // Get a list of internships
            agent.get('/api/internships')
              .end(function (internshipsGetErr, internshipsGetRes) {
                // Handle internship save error
                if (internshipsGetErr) {
                  return done(internshipsGetErr);
                }

                // Get internships list
                var internships = internshipsGetRes.body;

                // Set assertions
                (internships[0].user._id).should.equal(userId);
                (internships[0].title).should.match('Internship Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an internship if not logged in', function (done) {
    agent.post('/api/internships')
      .send(internship)
      .expect(403)
      .end(function (internshipSaveErr, internshipSaveRes) {
        // Call the assertion callback
        done(internshipSaveErr);
      });
  });

  it('should not be able to save an internship if no title is provided', function (done) {
    // Invalidate title field
    internship.title = '';

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

        // Save a new internship
        agent.post('/api/internships')
          .send(internship)
          .expect(400)
          .end(function (internshipSaveErr, internshipSaveRes) {
            // Set message assertion
            (internshipSaveRes.body.message).should.match('Title cannot be blank');

            // Handle internship save error
            done(internshipSaveErr);
          });
      });
  });

  it('should be able to update an internship if signed in', function (done) {
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

        // Save a new internship
        agent.post('/api/internships')
          .send(internship)
          .expect(200)
          .end(function (internshipSaveErr, internshipSaveRes) {
            // Handle internship save error
            if (internshipSaveErr) {
              return done(internshipSaveErr);
            }

            // Update internship title
            internship.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing internship
            agent.put('/api/internships/' + internshipSaveRes.body._id)
              .send(internship)
              .expect(200)
              .end(function (internshipUpdateErr, internshipUpdateRes) {
                // Handle internship update error
                if (internshipUpdateErr) {
                  return done(internshipUpdateErr);
                }

                // Set assertions
                (internshipUpdateRes.body._id).should.equal(internshipSaveRes.body._id);
                (internshipUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of internships if not signed in', function (done) {
    // Create new internship model instance
    var internshipObj = new Internship(internship);

    // Save the internship
    internshipObj.save(function () {
      // Request internships
      request(app).get('/api/internships')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single internship if not signed in', function (done) {
    // Create new internship model instance
    var internshipObj = new Internship(internship);

    // Save the internship
    internshipObj.save(function () {
      request(app).get('/api/internships/' + internshipObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', internship.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single internship with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/internships/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Internship is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single internship which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent internship
    request(app).get('/api/internships/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No internship with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an internship if signed in', function (done) {
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

        // Save a new internship
        agent.post('/api/internships')
          .send(internship)
          .expect(200)
          .end(function (internshipSaveErr, internshipSaveRes) {
            // Handle internship save error
            if (internshipSaveErr) {
              return done(internshipSaveErr);
            }

            // Delete an existing internship
            agent.delete('/api/internships/' + internshipSaveRes.body._id)
              .send(internship)
              .expect(200)
              .end(function (internshipDeleteErr, internshipDeleteRes) {
                // Handle internship error error
                if (internshipDeleteErr) {
                  return done(internshipDeleteErr);
                }

                // Set assertions
                (internshipDeleteRes.body._id).should.equal(internshipSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an internship if not signed in', function (done) {
    // Set internship user
    internship.user = user;

    // Create new internship model instance
    var internshipObj = new Internship(internship);

    // Save the internship
    internshipObj.save(function () {
      // Try deleting internship
      request(app).delete('/api/internships/' + internshipObj._id)
        .expect(403)
        .end(function (internshipDeleteErr, internshipDeleteRes) {
          // Set message assertion
          (internshipDeleteRes.body.message).should.match('User is not authorized');

          // Handle internship error error
          done(internshipDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Internship.remove().exec(done);
    });
  });
});
