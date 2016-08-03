'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adoption = mongoose.model('Adoption'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, adoption;

/**
 * Adoption routes tests
 */
describe('Adoption CRUD tests', function () {

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

    // Save a user to the test db and create new adoption
    user.save(function () {
      adoption = {
        title: 'Adoption Title',
        content: 'Adoption Content'
      };

      done();
    });
  });

  it('should be able to save an adoption if logged in', function (done) {
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

        // Save a new adoption
        agent.post('/api/adoptions')
          .send(adoption)
          .expect(200)
          .end(function (adoptionSaveErr, adoptionSaveRes) {
            // Handle adoption save error
            if (adoptionSaveErr) {
              return done(adoptionSaveErr);
            }

            // Get a list of adoptions
            agent.get('/api/adoptions')
              .end(function (adoptionsGetErr, adoptionsGetRes) {
                // Handle adoption save error
                if (adoptionsGetErr) {
                  return done(adoptionsGetErr);
                }

                // Get adoptions list
                var adoptions = adoptionsGetRes.body;

                // Set assertions
                (adoptions[0].user._id).should.equal(userId);
                (adoptions[0].title).should.match('Adoption Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an adoption if not logged in', function (done) {
    agent.post('/api/adoptions')
      .send(adoption)
      .expect(403)
      .end(function (adoptionSaveErr, adoptionSaveRes) {
        // Call the assertion callback
        done(adoptionSaveErr);
      });
  });

  it('should not be able to save an adoption if no title is provided', function (done) {
    // Invalidate title field
    adoption.title = '';

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

        // Save a new adoption
        agent.post('/api/adoptions')
          .send(adoption)
          .expect(400)
          .end(function (adoptionSaveErr, adoptionSaveRes) {
            // Set message assertion
            (adoptionSaveRes.body.message).should.match('Title cannot be blank');

            // Handle adoption save error
            done(adoptionSaveErr);
          });
      });
  });

  it('should be able to update an adoption if signed in', function (done) {
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

        // Save a new adoption
        agent.post('/api/adoptions')
          .send(adoption)
          .expect(200)
          .end(function (adoptionSaveErr, adoptionSaveRes) {
            // Handle adoption save error
            if (adoptionSaveErr) {
              return done(adoptionSaveErr);
            }

            // Update adoption title
            adoption.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing adoption
            agent.put('/api/adoptions/' + adoptionSaveRes.body._id)
              .send(adoption)
              .expect(200)
              .end(function (adoptionUpdateErr, adoptionUpdateRes) {
                // Handle adoption update error
                if (adoptionUpdateErr) {
                  return done(adoptionUpdateErr);
                }

                // Set assertions
                (adoptionUpdateRes.body._id).should.equal(adoptionSaveRes.body._id);
                (adoptionUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of adoptions if not signed in', function (done) {
    // Create new adoption model instance
    var adoptionObj = new Adoption(adoption);

    // Save the adoption
    adoptionObj.save(function () {
      // Request adoptions
      request(app).get('/api/adoptions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single adoption if not signed in', function (done) {
    // Create new adoption model instance
    var adoptionObj = new Adoption(adoption);

    // Save the adoption
    adoptionObj.save(function () {
      request(app).get('/api/adoptions/' + adoptionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', adoption.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single adoption with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adoptions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adoption is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single adoption which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent adoption
    request(app).get('/api/adoptions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No adoption with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an adoption if signed in', function (done) {
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

        // Save a new adoption
        agent.post('/api/adoptions')
          .send(adoption)
          .expect(200)
          .end(function (adoptionSaveErr, adoptionSaveRes) {
            // Handle adoption save error
            if (adoptionSaveErr) {
              return done(adoptionSaveErr);
            }

            // Delete an existing adoption
            agent.delete('/api/adoptions/' + adoptionSaveRes.body._id)
              .send(adoption)
              .expect(200)
              .end(function (adoptionDeleteErr, adoptionDeleteRes) {
                // Handle adoption error error
                if (adoptionDeleteErr) {
                  return done(adoptionDeleteErr);
                }

                // Set assertions
                (adoptionDeleteRes.body._id).should.equal(adoptionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an adoption if not signed in', function (done) {
    // Set adoption user
    adoption.user = user;

    // Create new adoption model instance
    var adoptionObj = new Adoption(adoption);

    // Save the adoption
    adoptionObj.save(function () {
      // Try deleting adoption
      request(app).delete('/api/adoptions/' + adoptionObj._id)
        .expect(403)
        .end(function (adoptionDeleteErr, adoptionDeleteRes) {
          // Set message assertion
          (adoptionDeleteRes.body.message).should.match('User is not authorized');

          // Handle adoption error error
          done(adoptionDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Adoption.remove().exec(done);
    });
  });
});
