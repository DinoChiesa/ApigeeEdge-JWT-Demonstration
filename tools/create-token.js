// create-token.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-March-15 14:53:47>

var version = '20180315-1453',
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    path = require('path'),
    now = Math.floor(Date.now() / 1000),
    oneHourInSeconds = 3600,
    defaults = {expiry: oneHourInSeconds, key : path.join(__dirname, 'keys', 'private-pkcs8.pem'), alg: 'HS256'},
    supportedAlgorithms = ['RS256','RS384','RS512','HS256','HS384','HS512'],
    Getopt = require('node-getopt'),
    getopt = new Getopt([
      ['A' , 'alg=ARG', 'required. algorithm. One of: ' + JSON.stringify(supportedAlgorithms)],
      ['s' , 'sub=ARG', 'optional. subject'],
      ['i' , 'iss=ARG', 'optional. issuer'],
      ['a' , 'aud=ARG', 'optional. audience'],
      ['e' , 'exp=ARG', 'expiry in seconds (default: ' + defaults.expiry + ')'],
      ['k' , 'key=ARG', 'for RS256, file containing signing key in PKCS8 format (default: ' + defaults.key + '). For HS256, the secretkey. (no default)'],
      ['N' , 'noNbf',   'omit the nbf claim'],
      ['I' , 'noIat',   'omit the iat claim'],
      ['C' , 'claim=ARG+', 'a custom claim to insert, in the format NAME:VALUE'],
      ['h' , 'help', 'display this help']
    ]).bindHelp();

console.log(
  'Example JWT creator tool, version: ' + version + '\n' +
    'Node.js ' + process.version + '\n');

var opt = getopt.parse(process.argv.slice(2));
if ( ! opt.options.alg) { opt.options.alg = defaults.alg; }

if (supportedAlgorithms.indexOf(opt.options.alg) < 0) {
  console.log('invalid value for algorithm.\n');
  getopt.showHelp();
  process.exit(1);
}
var key = (opt.options.alg.startsWith('RS')) ?
  fs.readFileSync(opt.options.key || defaults.key) : opt.options.key ;
if ( ! key) {
  console.log('You must provide a key.\n');
  getopt.showHelp();
  process.exit(1);
}
var claims = { };
if (! opt.options.noNbf) { claims.nbf = now; }
if (! opt.options.noIat) { claims.iat = now; }
if (opt.options.sub) { claims.sub = opt.options.sub; }
if (opt.options.iss) { claims.iss = opt.options.iss; }
if (opt.options.aud) { claims.aud = opt.options.aud; }
if (opt.options.exp) {
  claims.exp = now + parseInt(opt.options.exp);
}
else {
  claims.exp = now + defaults.expiry;
}

var re = new RegExp(':(.+)');
if (opt.options.claim) {
  opt.options.claim.forEach((claimString) => {
    var parts = claimString.split(re, 2);
    if (parts.length === 2) {
      claims[parts[0]] = parts[1];
    }
    else {
      console.log('non-parseable custom claim: ' + claimString);
    }
  });
}

var token = jwt.sign(claims, key, { algorithm: opt.options.alg });
console.log('JWT=' + token);

var decoded = jwt.decode(token, {complete:true});
console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
