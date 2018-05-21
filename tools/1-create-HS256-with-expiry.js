// 1-create-HS256-with-expiry.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-May-21 16:10:19>

const jwt = require('jsonwebtoken'),
      uuidv4 = require('uuid/v4'),
      expiry = Math.floor(Date.now() / 1000) + 3600,  // in seconds
      now = Math.floor(Date.now() / 1000);
var claims = {
      iss: 'http://myapp.com/',
      sub: 'users/user1234',
      aud: 'urn://Apigee',
      scope: 'read, add',
      roles: ['admin', 'user'],
      exp: expiry,
      nbf: now,
      jti: uuidv4()
    };
var secretPassphrase = 'Secret123';

var token = jwt.sign(claims, secretPassphrase, {algorithm: 'HS256'});
console.log('JWT:\n' + token);

var decoded = jwt.decode(token, {complete:true});
console.log('decoded: ' + JSON.stringify(decoded, null, 2));
