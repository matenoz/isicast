'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Classes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/classes',
      permissions: '*'
    }, {
      resources: '/api/classes/:classeId',
      permissions: '*'
    }]
  },{
    roles: ['god'],
    allows: [{
      resources: '/api/classes',
      permissions: '*'
    }, {
      resources: '/api/classes/:classeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/classes',
      permissions: ['get']
    }, {
      resources: '/api/classes/:classeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/classes',
      permissions: ['get']
    }, {
      resources: '/api/classes/:classeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Classes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an classe is being processed and the current user created it then allow any manipulation
  if (req.classe && req.user && req.classe.user.id === req.user.id) {
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
