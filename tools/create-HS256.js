// create-HS256.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-March-15 14:32:16>

var jwt = require('jsonwebtoken');
var claims = {
      iss: 'http://myapp.com/',
      sub: 'users/user1234',
      aud: 'urn://Apigee',
      scope: 'read, add',
      roles: ['admin', 'user']
    };
var secretPassphrase = 'Secret123';

// sign with HMAC SHA256
var token = jwt.sign(claims, secretPassphrase, { algorithm: 'HS256'});
console.log('JWT: ' + token);

var decoded = jwt.decode(token, {complete:true});
console.log('decoded: ' + JSON.stringify(decoded, null, 2));
