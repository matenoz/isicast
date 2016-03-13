'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rule = mongoose.model('Rule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, rule;

/**
 * Rule routes tests
 */
describe('Rule CRUD tests', function () {

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

    // Save a user to the test db and create new rule
    user.save(function () {
      rule = {
        title: 'Rule Title',
        content: 'Rule Content'
      };

      done();
    });
  });

  it('should be able to save an rule if logged in', function (done) {
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

        // Save a new rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Get a list of rules
            agent.get('/api/rules')
              .end(function (rulesGetErr, rulesGetRes) {
                // Handle rule save error
                if (rulesGetErr) {
                  return done(rulesGetErr);
                }

                // Get rules list
                var rules = rulesGetRes.body;

                // Set assertions
                (rules[0].user._id).should.equal(userId);
                (rules[0].title).should.match('Rule Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an rule if not logged in', function (done) {
    agent.post('/api/rules')
      .send(rule)
      .expect(403)
      .end(function (ruleSaveErr, ruleSaveRes) {
        // Call the assertion callback
        done(ruleSaveErr);
      });
  });

  it('should not be able to save an rule if no title is provided', function (done) {
    // Invalidate title field
    rule.title = '';

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

        // Save a new rule
        agent.post('/api/rules')
          .send(rule)
          .expect(400)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Set message assertion
            (ruleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle rule save error
            done(ruleSaveErr);
          });
      });
  });

  it('should be able to update an rule if signed in', function (done) {
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

        // Save a new rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Update rule title
            rule.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing rule
            agent.put('/api/rules/' + ruleSaveRes.body._id)
              .send(rule)
              .expect(200)
              .end(function (ruleUpdateErr, ruleUpdateRes) {
                // Handle rule update error
                if (ruleUpdateErr) {
                  return done(ruleUpdateErr);
                }

                // Set assertions
                (ruleUpdateRes.body._id).should.equal(ruleSaveRes.body._id);
                (ruleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of rules if not signed in', function (done) {
    // Create new rule model instance
    var ruleObj = new Rule(rule);

    // Save the rule
    ruleObj.save(function () {
      // Request rules
      request(app).get('/api/rules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single rule if not signed in', function (done) {
    // Create new rule model instance
    var ruleObj = new Rule(rule);

    // Save the rule
    ruleObj.save(function () {
      request(app).get('/api/rules/' + ruleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', rule.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single rule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/rules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single rule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent rule
    request(app).get('/api/rules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No rule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an rule if signed in', function (done) {
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

        // Save a new rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Delete an existing rule
            agent.delete('/api/rules/' + ruleSaveRes.body._id)
              .send(rule)
              .expect(200)
              .end(function (ruleDeleteErr, ruleDeleteRes) {
                // Handle rule error error
                if (ruleDeleteErr) {
                  return done(ruleDeleteErr);
                }

                // Set assertions
                (ruleDeleteRes.body._id).should.equal(ruleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an rule if not signed in', function (done) {
    // Set rule user
    rule.user = user;

    // Create new rule model instance
    var ruleObj = new Rule(rule);

    // Save the rule
    ruleObj.save(function () {
      // Try deleting rule
      request(app).delete('/api/rules/' + ruleObj._id)
        .expect(403)
        .end(function (ruleDeleteErr, ruleDeleteRes) {
          // Set message assertion
          (ruleDeleteRes.body.message).should.match('User is not authorized');

          // Handle rule error error
          done(ruleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Rule.remove().exec(done);
    });
  });
});
