// 1-create-HS256.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-06 12:33:22>

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var claims = {
      iss: "http://myapp.com/",  // The URL of your service
      sub: "users/user1234",    // The UID of the user in your system
      scope: "read, add",
      roles: ["admin", "user"]
    };
var secretPassphrase = 'Secret123';
var util = require('util');

//console.log('JWT: ' + util.inspect(jwt));

var token = jwt.sign(claims, secretPassphrase);
console.log('JWT: ' + token);

var decoded = jwt.decode(token);

console.log('decoded: ' + JSON.stringify(decoded, null, 2));


// //backdate a jwt 30 seconds
// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
//
// // sign with RSA SHA256
// var cert = fs.readFileSync('private.key');  // get private key
// var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});
//
// // sign asynchronously
// jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
//   console.log(token);
// });
//
