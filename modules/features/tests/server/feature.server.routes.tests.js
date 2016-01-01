'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feature = mongoose.model('Feature'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feature;

/**
 * Feature routes tests
 */
describe('Feature CRUD tests', function () {

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

    // Save a user to the test db and create new feature
    user.save(function () {
      feature = {
        title: 'Feature Title',
        content: 'Feature Content'
      };

      done();
    });
  });

  it('should be able to save an feature if logged in', function (done) {
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

        // Save a new feature
        agent.post('/api/features')
          .send(feature)
          .expect(200)
          .end(function (featureSaveErr, featureSaveRes) {
            // Handle feature save error
            if (featureSaveErr) {
              return done(featureSaveErr);
            }

            // Get a list of features
            agent.get('/api/features')
              .end(function (featuresGetErr, featuresGetRes) {
                // Handle feature save error
                if (featuresGetErr) {
                  return done(featuresGetErr);
                }

                // Get features list
                var features = featuresGetRes.body;

                // Set assertions
                (features[0].user._id).should.equal(userId);
                (features[0].title).should.match('Feature Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an feature if not logged in', function (done) {
    agent.post('/api/features')
      .send(feature)
      .expect(403)
      .end(function (featureSaveErr, featureSaveRes) {
        // Call the assertion callback
        done(featureSaveErr);
      });
  });

  it('should not be able to save an feature if no title is provided', function (done) {
    // Invalidate title field
    feature.title = '';

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

        // Save a new feature
        agent.post('/api/features')
          .send(feature)
          .expect(400)
          .end(function (featureSaveErr, featureSaveRes) {
            // Set message assertion
            (featureSaveRes.body.message).should.match('Title cannot be blank');

            // Handle feature save error
            done(featureSaveErr);
          });
      });
  });

  it('should be able to update an feature if signed in', function (done) {
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

        // Save a new feature
        agent.post('/api/features')
          .send(feature)
          .expect(200)
          .end(function (featureSaveErr, featureSaveRes) {
            // Handle feature save error
            if (featureSaveErr) {
              return done(featureSaveErr);
            }

            // Update feature title
            feature.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing feature
            agent.put('/api/features/' + featureSaveRes.body._id)
              .send(feature)
              .expect(200)
              .end(function (featureUpdateErr, featureUpdateRes) {
                // Handle feature update error
                if (featureUpdateErr) {
                  return done(featureUpdateErr);
                }

                // Set assertions
                (featureUpdateRes.body._id).should.equal(featureSaveRes.body._id);
                (featureUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of features if not signed in', function (done) {
    // Create new feature model instance
    var featureObj = new Feature(feature);

    // Save the feature
    featureObj.save(function () {
      // Request features
      request(app).get('/api/features')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single feature if not signed in', function (done) {
    // Create new feature model instance
    var featureObj = new Feature(feature);

    // Save the feature
    featureObj.save(function () {
      request(app).get('/api/features/' + featureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', feature.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single feature with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/features/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Feature is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single feature which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent feature
    request(app).get('/api/features/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No feature with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an feature if signed in', function (done) {
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

        // Save a new feature
        agent.post('/api/features')
          .send(feature)
          .expect(200)
          .end(function (featureSaveErr, featureSaveRes) {
            // Handle feature save error
            if (featureSaveErr) {
              return done(featureSaveErr);
            }

            // Delete an existing feature
            agent.delete('/api/features/' + featureSaveRes.body._id)
              .send(feature)
              .expect(200)
              .end(function (featureDeleteErr, featureDeleteRes) {
                // Handle feature error error
                if (featureDeleteErr) {
                  return done(featureDeleteErr);
                }

                // Set assertions
                (featureDeleteRes.body._id).should.equal(featureSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an feature if not signed in', function (done) {
    // Set feature user
    feature.user = user;

    // Create new feature model instance
    var featureObj = new Feature(feature);

    // Save the feature
    featureObj.save(function () {
      // Try deleting feature
      request(app).delete('/api/features/' + featureObj._id)
        .expect(403)
        .end(function (featureDeleteErr, featureDeleteRes) {
          // Set message assertion
          (featureDeleteRes.body.message).should.match('User is not authorized');

          // Handle feature error error
          done(featureDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Feature.remove().exec(done);
    });
  });
});
