// 2-create-HS256-with-expiry.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-06 13:00:43>

var jwt = require('jsonwebtoken');
var myJwtDecode = require('./myJwtDecode.js');
var expiry = Math.floor(Date.now() / 1000) + 3600; // in seconds
var secretPassphrase = 'Secret123';
var util = require('util');
var claims = {
      iss: "http://myapp.com/",  // The URL of your service
      sub: "users/user1234",    // The UID of the user in your system
      scope: "read, add",
      roles: ["admin", "user"],
      exp: expiry,
      nbf: Math.floor(Date.now() / 1000)
    };

var token = jwt.sign(claims, secretPassphrase); // default is HS256
console.log('JWT:\n' + token);

var decoded = myJwtDecode(token); // jwt.decode(token);
console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
