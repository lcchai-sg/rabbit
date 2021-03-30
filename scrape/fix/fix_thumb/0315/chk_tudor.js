const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./u_tudor');

(async () => {
  let cnt = 0; let stop = '';
  for (let i = 0; i < u.length && stop !== 'y'; i++) {
    const cmdjpg = 'open -g -a "Safari" "' + u[i] + '"';
    await exec(cmdjpg);
    cnt++;
    if (cnt > 0 && cnt % 50 === 0) {
      stop = prompt("stop processing ? ");
    }
  }
  console.log();
  console.log('done.');
  process.exit(0);
})();