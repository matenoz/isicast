'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Classe = mongoose.model('Classe'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, classe;

/**
 * Classe routes tests
 */
describe('Classe CRUD tests', function () {

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

    // Save a user to the test db and create new classe
    user.save(function () {
      classe = {
        title: 'Classe Title',
        content: 'Classe Content'
      };

      done();
    });
  });

  it('should be able to save an classe if logged in', function (done) {
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

        // Save a new classe
        agent.post('/api/classes')
          .send(classe)
          .expect(200)
          .end(function (classeSaveErr, classeSaveRes) {
            // Handle classe save error
            if (classeSaveErr) {
              return done(classeSaveErr);
            }

            // Get a list of classes
            agent.get('/api/classes')
              .end(function (classesGetErr, classesGetRes) {
                // Handle classe save error
                if (classesGetErr) {
                  return done(classesGetErr);
                }

                // Get classes list
                var classes = classesGetRes.body;

                // Set assertions
                (classes[0].user._id).should.equal(userId);
                (classes[0].title).should.match('Classe Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an classe if not logged in', function (done) {
    agent.post('/api/classes')
      .send(classe)
      .expect(403)
      .end(function (classeSaveErr, classeSaveRes) {
        // Call the assertion callback
        done(classeSaveErr);
      });
  });

  it('should not be able to save an classe if no title is provided', function (done) {
    // Invalidate title field
    classe.title = '';

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

        // Save a new classe
        agent.post('/api/classes')
          .send(classe)
          .expect(400)
          .end(function (classeSaveErr, classeSaveRes) {
            // Set message assertion
            (classeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle classe save error
            done(classeSaveErr);
          });
      });
  });

  it('should be able to update an classe if signed in', function (done) {
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

        // Save a new classe
        agent.post('/api/classes')
          .send(classe)
          .expect(200)
          .end(function (classeSaveErr, classeSaveRes) {
            // Handle classe save error
            if (classeSaveErr) {
              return done(classeSaveErr);
            }

            // Update classe title
            classe.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing classe
            agent.put('/api/classes/' + classeSaveRes.body._id)
              .send(classe)
              .expect(200)
              .end(function (classeUpdateErr, classeUpdateRes) {
                // Handle classe update error
                if (classeUpdateErr) {
                  return done(classeUpdateErr);
                }

                // Set assertions
                (classeUpdateRes.body._id).should.equal(classeSaveRes.body._id);
                (classeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of classes if not signed in', function (done) {
    // Create new classe model instance
    var classeObj = new Classe(classe);

    // Save the classe
    classeObj.save(function () {
      // Request classes
      request(app).get('/api/classes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single classe if not signed in', function (done) {
    // Create new classe model instance
    var classeObj = new Classe(classe);

    // Save the classe
    classeObj.save(function () {
      request(app).get('/api/classes/' + classeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', classe.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single classe with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/classes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Classe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single classe which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent classe
    request(app).get('/api/classes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No classe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an classe if signed in', function (done) {
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

        // Save a new classe
        agent.post('/api/classes')
          .send(classe)
          .expect(200)
          .end(function (classeSaveErr, classeSaveRes) {
            // Handle classe save error
            if (classeSaveErr) {
              return done(classeSaveErr);
            }

            // Delete an existing classe
            agent.delete('/api/classes/' + classeSaveRes.body._id)
              .send(classe)
              .expect(200)
              .end(function (classeDeleteErr, classeDeleteRes) {
                // Handle classe error error
                if (classeDeleteErr) {
                  return done(classeDeleteErr);
                }

                // Set assertions
                (classeDeleteRes.body._id).should.equal(classeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an classe if not signed in', function (done) {
    // Set classe user
    classe.user = user;

    // Create new classe model instance
    var classeObj = new Classe(classe);

    // Save the classe
    classeObj.save(function () {
      // Try deleting classe
      request(app).delete('/api/classes/' + classeObj._id)
        .expect(403)
        .end(function (classeDeleteErr, classeDeleteRes) {
          // Set message assertion
          (classeDeleteRes.body.message).should.match('User is not authorized');

          // Handle classe error error
          done(classeDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Classe.remove().exec(done);
    });
  });
});
