#!/usr/bin/env node
const u = require('./u_joma_assets');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();

(async () => {
  try {
    let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
      const cmd = 'open -g -a "Safari" "' + u[i] + '"';
      await exec(cmd);
      if (i > 0 && i % 50 === 0) {
          stop = prompt("stop processing ? ");
      }
    }
  } catch (err) {
    console.error(err);
  };
  console.log();
  console.log('done.');
  process.exit(0);
})();
