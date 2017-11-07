// example1.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-06 12:25:26>

var jwtnode = require('jwt-node');
var secureRandom = require('secure-random');

var signingKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes

var claims = {
      iss: "http://myapp.com/",  // The URL of your service
      sub: "users/user1234",    // The UID of the user in your system
      scope: "self, admins"
    };

var jwt = jwtnode.create(claims,signingKey);

console.log('JWT: ' + jwt);

//var decoded = jwtnode.create(claims,signingKey);
