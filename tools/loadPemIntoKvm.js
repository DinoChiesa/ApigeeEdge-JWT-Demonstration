#! /usr/local/bin/node
/*jslint node:true */
// loadPemIntoKvm.js
// ------------------------------------------------------------------
// load a PEM into Apigee Edge KVM
//
// Copyright 2017-2018 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// last saved: <2018-June-06 16:59:02>

var fs = require('fs'),
    edgejs = require('apigee-edge-js'),
    common = edgejs.utility,
    apigeeEdge = edgejs.edge,
    sprintf = require('sprintf-js').sprintf,
    async = require('async'),
    Getopt = require('node-getopt'),
    version = '20180606-1659',
    defaults = { mapname : 'PrivateKeys' },
    getopt = new Getopt(common.commonOptions.concat([
      ['e' , 'env=ARG', 'required. the Edge environment for which to store the KVM data'],
      ['m' , 'mapname=ARG', 'optional. name of the KVM in Edge for keys. Will be created if nec. Default: ' + defaults.mapname],
      ['E' , 'encrypted', 'optional. if creating a KVM, set it as encrypted. Default: not.'],
      ['F' , 'pemfile=ARG', 'required. name of the file containing the pem-encoded key.'],
      ['N' , 'entryname=ARG', 'required. name of the entry in KVM to store the PEM.'],
      ['T' , 'notoken', 'optional. do not try to get a authentication token.']
    ])).bindHelp();

// ========================================================

console.log(
  'Apigee Edge PEM KVM-loader tool, version: ' + version + '\n' +
    'Node.js ' + process.version + '\n');

common.logWrite('start');

// process.argv array starts with 'node' and 'scriptname.js'
var opt = getopt.parse(process.argv.slice(2));

if ( !opt.options.env ) {
  console.log('You must specify an environment');
  getopt.showHelp();
  process.exit(1);
}

if ( !opt.options.mapname ) {
  common.logWrite(sprintf('defaulting to %s for KVM mapname', defaults.mapname));
  opt.options.mapname = defaults.mapname;
}

common.verifyCommonRequiredParameters(opt.options, getopt);

function loadKeyIntoMap(org, cb) {
  var re = new RegExp('(?:\r\n|\r|\n)', 'g');
  var pemcontent = fs.readFileSync(opt.options.pemfile, "utf8").replace(re,'\n');
  var options = {
        env: opt.options.env,
        kvm: opt.options.mapname,
        key: opt.options.entryname,
        value: pemcontent
      };
  common.logWrite('storing new key');
  org.kvms.put(options, cb);
}

function keysLoadedCb(e, result){
  if (e) {
    common.logWrite(JSON.stringify(e, null, 2));
    //console.log(e.stack);
    process.exit(1);
  }
  common.logWrite('ok. the key was loaded successfully.');
}

var options = {
      mgmtServer: opt.options.mgmtserver,
      org : opt.options.org,
      user: opt.options.username,
      password: opt.options.password,
      no_token: opt.options.notoken,
      verbosity: opt.options.verbose || 0
    };

apigeeEdge.connect(options, function(e, org) {
  if (e) {
    common.logWrite(JSON.stringify(e, null, 2));
    //console.log(e.stack);
    process.exit(1);
  }
  common.logWrite('connected');

  org.kvms.get({ env: opt.options.env }, function(e, result) {
    if (e) {
      common.logWrite(JSON.stringify(e, null, 2));
      //console.log(e.stack);
      process.exit(1);
    }

    if (result.indexOf(opt.options.mapname) == -1) {
      // the map does not yet exist
      common.logWrite('Need to create the map');
      org.kvms.create({ env: opt.options.env, name: opt.options.mapname, encrypted:opt.options.encrypted},
                      function(e, result) {
        if (e) {
          common.logWrite(JSON.stringify(e, null, 2));
          //console.log(e.stack);
          process.exit(1);
        }
        loadKeyIntoMap(org, keysLoadedCb);
      });
    }
    else {
      common.logWrite('ok. the required map exists');
      loadKeyIntoMap(org, keysLoadedCb);
    }
  });
});
