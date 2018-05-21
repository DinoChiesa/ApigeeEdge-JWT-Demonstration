// 2-create-RS256-with-expiry.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-May-21 15:51:17>

const jwt = require('jsonwebtoken'),
 fs = require('fs'),
 path = require('path'),
 uuidv4 = require('uuid/v4'),
 now = Math.floor(Date.now() / 1000),
 oneHourInSeconds = 3600;
var claims = {
      iss: 'http://myapp.com/',
      sub: 'users/user1234',
      aud: 'urn://Apigee',
      roles: ['admin', 'user'],
      exp: now + oneHourInSeconds,
      nbf: now,
      jti: uuidv4()
    };

var filename = path.resolve(path.dirname(process.mainModule.filename), 'keys', 'private-pkcs8.pem');
var cert = fs.readFileSync(filename);  // get private key
var token = jwt.sign(claims, cert, { algorithm: 'RS256'});
console.log('JWT:\n' + token);

var decoded = jwt.decode(token, {complete:true});
console.log('decoded: ' + JSON.stringify(decoded, null, 2));
