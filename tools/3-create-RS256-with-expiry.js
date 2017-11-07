// 3-create-RS256-with-expiry.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-06 13:00:31>

var jwt = require('jsonwebtoken');
var myJwtDecode = require('./myJwtDecode.js');
var now = Math.floor(Date.now() / 1000);
var oneHourInSeconds = 3600;
var secretPassphrase = 'Secret123';
//var util = require('util');
var fs = require('fs');
var claims = {
      iss: "http://myapp.com/",  // The URL of your service
      sub: "users/user1234",    // The UID of the user in your system
      roles: ["admin", "user"],
      exp: now + oneHourInSeconds,
      nbf: now
    };

var cert = fs.readFileSync('keys/private-pkcs8.pem');  // get private key
var token = jwt.sign(claims, cert, { algorithm: 'RS256'});
console.log('JWT:\n' + token);

decoded = myJwtDecode(token); // jwt.decode(token); Does not decode header
console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
