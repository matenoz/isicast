'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Doc = mongoose.model('Doc'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, doc;

/**
 * Doc routes tests
 */
describe('Doc CRUD tests', function () {

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

    // Save a user to the test db and create new doc
    user.save(function () {
      doc = {
        title: 'Doc Title',
        content: 'Doc Content'
      };

      done();
    });
  });

  it('should be able to save an doc if logged in', function (done) {
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

        // Save a new doc
        agent.post('/api/docs')
          .send(doc)
          .expect(200)
          .end(function (docSaveErr, docSaveRes) {
            // Handle doc save error
            if (docSaveErr) {
              return done(docSaveErr);
            }

            // Get a list of docs
            agent.get('/api/docs')
              .end(function (docsGetErr, docsGetRes) {
                // Handle doc save error
                if (docsGetErr) {
                  return done(docsGetErr);
                }

                // Get docs list
                var docs = docsGetRes.body;

                // Set assertions
                (docs[0].user._id).should.equal(userId);
                (docs[0].title).should.match('Doc Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an doc if not logged in', function (done) {
    agent.post('/api/docs')
      .send(doc)
      .expect(403)
      .end(function (docSaveErr, docSaveRes) {
        // Call the assertion callback
        done(docSaveErr);
      });
  });

  it('should not be able to save an doc if no title is provided', function (done) {
    // Invalidate title field
    doc.title = '';

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

        // Save a new doc
        agent.post('/api/docs')
          .send(doc)
          .expect(400)
          .end(function (docSaveErr, docSaveRes) {
            // Set message assertion
            (docSaveRes.body.message).should.match('Title cannot be blank');

            // Handle doc save error
            done(docSaveErr);
          });
      });
  });

  it('should be able to update an doc if signed in', function (done) {
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

        // Save a new doc
        agent.post('/api/docs')
          .send(doc)
          .expect(200)
          .end(function (docSaveErr, docSaveRes) {
            // Handle doc save error
            if (docSaveErr) {
              return done(docSaveErr);
            }

            // Update doc title
            doc.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing doc
            agent.put('/api/docs/' + docSaveRes.body._id)
              .send(doc)
              .expect(200)
              .end(function (docUpdateErr, docUpdateRes) {
                // Handle doc update error
                if (docUpdateErr) {
                  return done(docUpdateErr);
                }

                // Set assertions
                (docUpdateRes.body._id).should.equal(docSaveRes.body._id);
                (docUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of docs if not signed in', function (done) {
    // Create new doc model instance
    var docObj = new Doc(doc);

    // Save the doc
    docObj.save(function () {
      // Request docs
      request(app).get('/api/docs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single doc if not signed in', function (done) {
    // Create new doc model instance
    var docObj = new Doc(doc);

    // Save the doc
    docObj.save(function () {
      request(app).get('/api/docs/' + docObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', doc.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single doc with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/docs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Doc is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single doc which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent doc
    request(app).get('/api/docs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No doc with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an doc if signed in', function (done) {
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

        // Save a new doc
        agent.post('/api/docs')
          .send(doc)
          .expect(200)
          .end(function (docSaveErr, docSaveRes) {
            // Handle doc save error
            if (docSaveErr) {
              return done(docSaveErr);
            }

            // Delete an existing doc
            agent.delete('/api/docs/' + docSaveRes.body._id)
              .send(doc)
              .expect(200)
              .end(function (docDeleteErr, docDeleteRes) {
                // Handle doc error error
                if (docDeleteErr) {
                  return done(docDeleteErr);
                }

                // Set assertions
                (docDeleteRes.body._id).should.equal(docSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an doc if not signed in', function (done) {
    // Set doc user
    doc.user = user;

    // Create new doc model instance
    var docObj = new Doc(doc);

    // Save the doc
    docObj.save(function () {
      // Try deleting doc
      request(app).delete('/api/docs/' + docObj._id)
        .expect(403)
        .end(function (docDeleteErr, docDeleteRes) {
          // Set message assertion
          (docDeleteRes.body.message).should.match('User is not authorized');

          // Handle doc error error
          done(docDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Doc.remove().exec(done);
    });
  });
});
