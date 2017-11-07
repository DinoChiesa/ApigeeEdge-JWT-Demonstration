// verify-token.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-07 14:19:20>

var version = '20171106-1714',
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    path = require('path'),
    re = new RegExp(':(.+)'),
    oneHourInSeconds = 3600,
    defaults = {expiry: oneHourInSeconds, key : path.join(__dirname, 'keys/public.pem'), alg: 'HS256'},
    supportedAlgorithms = ['RS256','RS384','RS512','HS256','HS384','HS512'],
    Getopt = require('node-getopt'),
    getopt = new Getopt([
      ['t' , 'token=ARG', 'required. token to verify.'],
      ['A' , 'alg=ARG', 'required. algorithm. One of: ' + JSON.stringify(supportedAlgorithms)],
      ['s' , 'sub=ARG', 'optional. subject to verify'],
      ['i' , 'iss=ARG', 'optional. issuer to verify'],
      ['a' , 'aud=ARG', 'optional. audience to verify'],
      ['k' , 'key=ARG', 'for RS256, file containing signing key in PKCS8 format (default: ' + defaults.privatekey + '). For HS256, the secretkey.'],
      ['C' , 'claim=ARG+', 'a custom claim to verify, in the format NAME:VALUE'],
      ['h' , 'help', 'display this help']
    ]).bindHelp();

console.log(
  'Example JWT verifier tool, version: ' + version + '\n' +
    'Node.js ' + process.version + '\n');

var opt = getopt.parse(process.argv.slice(2));
if (! opt.options.alg) {
  console.log('You must provide a token.\n');
  getopt.showHelp();
  process.exit(1);
}
if (! opt.options.alg) { opt.options.alg = defaults.alg; }
if (supportedAlgorithms.indexOf(opt.options.alg) < 0) {
  console.log('invalid value for algorithm.\n');
  getopt.showHelp();
  process.exit(1);
}
var key = (opt.options.alg.startsWith('RS')) ?
  fs.readFileSync(opt.options.key || defaults.key) : opt.options.key ;
if (! key) {
  console.log('You must provide a key.\n');
  getopt.showHelp();
  process.exit(1);
}
var verificationOptions = { algorithms: [opt.options.alg] };
if (opt.options.sub) { verificationOptions.subject = opt.options.sub; }
if (opt.options.iss) { verificationOptions.issuer = opt.options.iss; }
if (opt.options.aud) { verificationOptions.audience = opt.options.aud; }

jwt.verify(opt.options.token, key, verificationOptions, function(e, decoded) {
  if (e) {
    console.log('Error while verifying: ' + e);
    process.exit(1);
  }
  console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
  if (opt.options.claim) {
    opt.options.claim.forEach((claimString) => {
      var parts = claimString.split(re, 2);
      if (parts.length === 2) {
        if (decoded[parts[0]] && decoded[parts[0]] === parts[1]) {
        }
        else {
          console.log('invalid: claim mismatch: ' + parts[0]);
          console.log('  ' + parts[1] + ' != ' + decoded[parts[0]] );
        }
      }
      else {
        console.log('non-parseable custom claim: ' + claimString);
      }
    });
  }
});
