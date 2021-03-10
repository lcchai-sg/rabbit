#!/usr/bin/env node
const u = require('./a_todel');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async () => {
  try {
    for (let i = 0; i < u.length; i++) {
      const cmd = 'open -a "Google Chrome" "https://synopsis.cosmos.ieplsg.com/files/' + u[i] + '"';
      const { stdout, stderr } = await exec(cmd);
      if (stdout.match(/HTTP\/2 202/i)) console.log(u.length, i, u[i], 'removed successful');
      else if (stdout.match(/HTTP\/2 404/i)) console.log(u.length, i, u[i], 'NOT FOUND');
      else if (stdout) console.log(u.length, i, stdout);
      if (stderr.match(/HTTP\/2 202/i)) console.log(u.length, i, u[i], 'removed successful');
      else if (stderr.match(/HTTP\/2 404/i)) console.log(u.length, i, u[i], 'NOT FOUND');
      else if (stderr) console.log(u.length, i, 'ERROR : ', stderr);
      await new Promise(r => setTimeout(r, 3000))
    }
  } catch (err) {
    console.error(err);
  };
})();
