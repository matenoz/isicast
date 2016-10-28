'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Docs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/docs',
      permissions: '*'
    }, {
      resources: '/api/docs/:docId',
      permissions: '*'
    }]
  },{
    roles: ['public'],
    allows: [{
      resources: '/api/docs',
      permissions: '*'
    }, {
      resources: '/api/docs/:docId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/docs',
      permissions: ['get']
    }, {
      resources: '/api/docs/:docId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/docs',
      permissions: ['get']
    }, {
      resources: '/api/docs/:docId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Docs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an doc is being processed and the current user created it then allow any manipulation
  if (req.doc && req.user && req.doc.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
