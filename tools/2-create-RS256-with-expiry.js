// 2-create-RS256-with-expiry.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-March-15 14:39:50>

var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
var now = Math.floor(Date.now() / 1000);
var oneHourInSeconds = 3600;
var claims = {
      iss: 'http://myapp.com/',
      sub: 'users/user1234',
      aud: 'urn://Apigee',
      roles: ['admin', 'user'],
      exp: now + oneHourInSeconds,
      nbf: now
    };

var filename = path.resolve(path.dirname(process.mainModule.filename), 'keys', 'private-pkcs8.pem');
var cert = fs.readFileSync(filename);  // get private key
var token = jwt.sign(claims, cert, { algorithm: 'RS256'});
console.log('JWT:\n' + token);

var decoded = jwt.decode(token, {complete:true});
console.log('decoded: ' + JSON.stringify(decoded, null, 2));
