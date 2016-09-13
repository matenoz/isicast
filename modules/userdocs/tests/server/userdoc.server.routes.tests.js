'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userdoc = mongoose.model('Userdoc'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, userdoc;

/**
 * Userdoc routes tests
 */
describe('Userdoc CRUD tests', function () {

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

    // Save a user to the test db and create new userdoc
    user.save(function () {
      userdoc = {
        title: 'Userdoc Title',
        content: 'Userdoc Content'
      };

      done();
    });
  });

  it('should be able to save an userdoc if logged in', function (done) {
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

        // Save a new userdoc
        agent.post('/api/userdocs')
          .send(userdoc)
          .expect(200)
          .end(function (userdocSaveErr, userdocSaveRes) {
            // Handle userdoc save error
            if (userdocSaveErr) {
              return done(userdocSaveErr);
            }

            // Get a list of userdocs
            agent.get('/api/userdocs')
              .end(function (userdocsGetErr, userdocsGetRes) {
                // Handle userdoc save error
                if (userdocsGetErr) {
                  return done(userdocsGetErr);
                }

                // Get userdocs list
                var userdocs = userdocsGetRes.body;

                // Set assertions
                (userdocs[0].user._id).should.equal(userId);
                (userdocs[0].title).should.match('Userdoc Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an userdoc if not logged in', function (done) {
    agent.post('/api/userdocs')
      .send(userdoc)
      .expect(403)
      .end(function (userdocSaveErr, userdocSaveRes) {
        // Call the assertion callback
        done(userdocSaveErr);
      });
  });

  it('should not be able to save an userdoc if no title is provided', function (done) {
    // Invalidate title field
    userdoc.title = '';

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

        // Save a new userdoc
        agent.post('/api/userdocs')
          .send(userdoc)
          .expect(400)
          .end(function (userdocSaveErr, userdocSaveRes) {
            // Set message assertion
            (userdocSaveRes.body.message).should.match('Title cannot be blank');

            // Handle userdoc save error
            done(userdocSaveErr);
          });
      });
  });

  it('should be able to update an userdoc if signed in', function (done) {
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

        // Save a new userdoc
        agent.post('/api/userdocs')
          .send(userdoc)
          .expect(200)
          .end(function (userdocSaveErr, userdocSaveRes) {
            // Handle userdoc save error
            if (userdocSaveErr) {
              return done(userdocSaveErr);
            }

            // Update userdoc title
            userdoc.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing userdoc
            agent.put('/api/userdocs/' + userdocSaveRes.body._id)
              .send(userdoc)
              .expect(200)
              .end(function (userdocUpdateErr, userdocUpdateRes) {
                // Handle userdoc update error
                if (userdocUpdateErr) {
                  return done(userdocUpdateErr);
                }

                // Set assertions
                (userdocUpdateRes.body._id).should.equal(userdocSaveRes.body._id);
                (userdocUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of userdocs if not signed in', function (done) {
    // Create new userdoc model instance
    var userdocObj = new Userdoc(userdoc);

    // Save the userdoc
    userdocObj.save(function () {
      // Request userdocs
      request(app).get('/api/userdocs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single userdoc if not signed in', function (done) {
    // Create new userdoc model instance
    var userdocObj = new Userdoc(userdoc);

    // Save the userdoc
    userdocObj.save(function () {
      request(app).get('/api/userdocs/' + userdocObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', userdoc.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single userdoc with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userdocs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userdoc is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single userdoc which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent userdoc
    request(app).get('/api/userdocs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No userdoc with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an userdoc if signed in', function (done) {
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

        // Save a new userdoc
        agent.post('/api/userdocs')
          .send(userdoc)
          .expect(200)
          .end(function (userdocSaveErr, userdocSaveRes) {
            // Handle userdoc save error
            if (userdocSaveErr) {
              return done(userdocSaveErr);
            }

            // Delete an existing userdoc
            agent.delete('/api/userdocs/' + userdocSaveRes.body._id)
              .send(userdoc)
              .expect(200)
              .end(function (userdocDeleteErr, userdocDeleteRes) {
                // Handle userdoc error error
                if (userdocDeleteErr) {
                  return done(userdocDeleteErr);
                }

                // Set assertions
                (userdocDeleteRes.body._id).should.equal(userdocSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an userdoc if not signed in', function (done) {
    // Set userdoc user
    userdoc.user = user;

    // Create new userdoc model instance
    var userdocObj = new Userdoc(userdoc);

    // Save the userdoc
    userdocObj.save(function () {
      // Try deleting userdoc
      request(app).delete('/api/userdocs/' + userdocObj._id)
        .expect(403)
        .end(function (userdocDeleteErr, userdocDeleteRes) {
          // Set message assertion
          (userdocDeleteRes.body.message).should.match('User is not authorized');

          // Handle userdoc error error
          done(userdocDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Userdoc.remove().exec(done);
    });
  });
});
