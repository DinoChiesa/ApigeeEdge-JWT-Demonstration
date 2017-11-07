// decode-token.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2017-November-06 17:47:36>

var version = '20171106-1714',
    myJwtDecode = require('./myJwtDecode.js'),
    Getopt = require('node-getopt'),
    getopt = new Getopt([
      ['t' , 'token=ARG',   'the token in compact form'],
      ['h' , 'help', 'display this help']
    ]).bindHelp();

console.log(
  'Example JWT decoder tool, version: ' + version + '\n' +
    'Node.js ' + process.version + '\n');

var opt = getopt.parse(process.argv.slice(2));
if ( ! opt.options.token) {
  console.log('You must provide a token.\n');
  getopt.showHelp();
  process.exit(1);
}
var decoded = myJwtDecode(opt.options.token); // jwt.decode(token); Does not decode header
console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
