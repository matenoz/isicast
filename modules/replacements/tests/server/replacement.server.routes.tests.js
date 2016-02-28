'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Replacement = mongoose.model('Replacement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, replacement;

/**
 * Replacement routes tests
 */
describe('Replacement CRUD tests', function () {

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

    // Save a user to the test db and create new replacement
    user.save(function () {
      replacement = {
        title: 'Replacement Title',
        content: 'Replacement Content'
      };

      done();
    });
  });

  it('should be able to save an replacement if logged in', function (done) {
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

        // Save a new replacement
        agent.post('/api/replacements')
          .send(replacement)
          .expect(200)
          .end(function (replacementSaveErr, replacementSaveRes) {
            // Handle replacement save error
            if (replacementSaveErr) {
              return done(replacementSaveErr);
            }

            // Get a list of replacements
            agent.get('/api/replacements')
              .end(function (replacementsGetErr, replacementsGetRes) {
                // Handle replacement save error
                if (replacementsGetErr) {
                  return done(replacementsGetErr);
                }

                // Get replacements list
                var replacements = replacementsGetRes.body;

                // Set assertions
                (replacements[0].user._id).should.equal(userId);
                (replacements[0].title).should.match('Replacement Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an replacement if not logged in', function (done) {
    agent.post('/api/replacements')
      .send(replacement)
      .expect(403)
      .end(function (replacementSaveErr, replacementSaveRes) {
        // Call the assertion callback
        done(replacementSaveErr);
      });
  });

  it('should not be able to save an replacement if no title is provided', function (done) {
    // Invalidate title field
    replacement.title = '';

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

        // Save a new replacement
        agent.post('/api/replacements')
          .send(replacement)
          .expect(400)
          .end(function (replacementSaveErr, replacementSaveRes) {
            // Set message assertion
            (replacementSaveRes.body.message).should.match('Title cannot be blank');

            // Handle replacement save error
            done(replacementSaveErr);
          });
      });
  });

  it('should be able to update an replacement if signed in', function (done) {
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

        // Save a new replacement
        agent.post('/api/replacements')
          .send(replacement)
          .expect(200)
          .end(function (replacementSaveErr, replacementSaveRes) {
            // Handle replacement save error
            if (replacementSaveErr) {
              return done(replacementSaveErr);
            }

            // Update replacement title
            replacement.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing replacement
            agent.put('/api/replacements/' + replacementSaveRes.body._id)
              .send(replacement)
              .expect(200)
              .end(function (replacementUpdateErr, replacementUpdateRes) {
                // Handle replacement update error
                if (replacementUpdateErr) {
                  return done(replacementUpdateErr);
                }

                // Set assertions
                (replacementUpdateRes.body._id).should.equal(replacementSaveRes.body._id);
                (replacementUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of replacements if not signed in', function (done) {
    // Create new replacement model instance
    var replacementObj = new Replacement(replacement);

    // Save the replacement
    replacementObj.save(function () {
      // Request replacements
      request(app).get('/api/replacements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single replacement if not signed in', function (done) {
    // Create new replacement model instance
    var replacementObj = new Replacement(replacement);

    // Save the replacement
    replacementObj.save(function () {
      request(app).get('/api/replacements/' + replacementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', replacement.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single replacement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/replacements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Replacement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single replacement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent replacement
    request(app).get('/api/replacements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No replacement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an replacement if signed in', function (done) {
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

        // Save a new replacement
        agent.post('/api/replacements')
          .send(replacement)
          .expect(200)
          .end(function (replacementSaveErr, replacementSaveRes) {
            // Handle replacement save error
            if (replacementSaveErr) {
              return done(replacementSaveErr);
            }

            // Delete an existing replacement
            agent.delete('/api/replacements/' + replacementSaveRes.body._id)
              .send(replacement)
              .expect(200)
              .end(function (replacementDeleteErr, replacementDeleteRes) {
                // Handle replacement error error
                if (replacementDeleteErr) {
                  return done(replacementDeleteErr);
                }

                // Set assertions
                (replacementDeleteRes.body._id).should.equal(replacementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an replacement if not signed in', function (done) {
    // Set replacement user
    replacement.user = user;

    // Create new replacement model instance
    var replacementObj = new Replacement(replacement);

    // Save the replacement
    replacementObj.save(function () {
      // Try deleting replacement
      request(app).delete('/api/replacements/' + replacementObj._id)
        .expect(403)
        .end(function (replacementDeleteErr, replacementDeleteRes) {
          // Set message assertion
          (replacementDeleteRes.body.message).should.match('User is not authorized');

          // Handle replacement error error
          done(replacementDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Replacement.remove().exec(done);
    });
  });
});
