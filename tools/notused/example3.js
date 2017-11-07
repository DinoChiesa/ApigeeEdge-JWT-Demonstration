// example3.js
// ------------------------------------------------------------------
//
// Description goes here....
//
// created: Mon Sep 11 15:15:47 2017
// last saved: <2017-September-14 16:53:37>

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var passphrase = 'secret1234567890ABCDEFGH';

function showToken(token) {
  console.log(token);
  var parts = token.split('.');
  parts.forEach(function(part){
    console.log(part);
  });
  console.log();
}

var additionalHeaderFields = { } ;
var payload = {
      'double-values': [1982922.23039, -920.398398212, 239892.98494803]
    };

var options = { algorithm: 'HS256', noTimestamp:true };
var token = jwt.sign(payload, passphrase, options);
showToken(token);


passphrase = 'secret';

payload = {
      name: [1, 2, 3]
    };

var token = jwt.sign(payload, passphrase, options);
showToken(token);


