// example2.js
// ------------------------------------------------------------------
//
// Description goes here....
//
// created: Mon Sep 11 15:15:47 2017
// last saved: <2017-September-14 16:53:49>

// sign with default (HMAC SHA256)
function showToken(token) {
  console.log(token);
  var parts = token.split('.');
  parts.forEach(function(part){
    console.log(part);
  });
  console.log();
}

var jwt = require('jsonwebtoken');
var passphrase = 'ABCDEFGHIJK0123456789';
var token = jwt.sign({ foo: 'bar' }, passphrase);
showToken(token);

var header = {
      typ: 'JWT',
      b64: false,
      'http://openbanking.org.uk/iss' : 'C=UK, ST=England, L=London, O=Acme Ltd.',
      'http://openbanking.org.uk/iat' : '2017-06-12T20:05:50+00:00',
      crit : ['b64', 'http://openbanking.org.uk/iss', 'http://openbanking.org.uk/iat']
    };
var data = {
      potential: 'high',
      acctid : 'AA7F9F9B-CDF5-4CD0-949E-829AC879E201'
    };

var risk = {
      seven: 5
    };
var payload = { iss: 'bar', data:data, risk:risk };
var options = { algorithm: 'HS256', header:header, noTimestamp: false};
var token = jwt.sign(payload, passphrase, options);
