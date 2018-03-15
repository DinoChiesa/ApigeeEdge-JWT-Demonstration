// decode-token.js
// ------------------------------------------------------------------
//
// created: Mon Sep 11 14:47:45 2017
// last saved: <2018-March-15 14:09:52>

var version = '20180315-1409',
    jwt = require('jsonwebtoken'),
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

var decoded = jwt.decode(opt.options.token, {complete:true});
console.log('\ndecoded:\n' + JSON.stringify(decoded, null, 2));
