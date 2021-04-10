const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./assets');

(async () => {
    const data = await fs.readFile("u_assets.txt");
    const u = data.toString().split('\n');
    let stop = ''; let cnt = 0;
    const fp = "https://synopsis.cosmos.ieplsg.com/files/";
    for (let i = 0; i < 27400 && stop !== 'y'; i++) {
        const url = u[i].split(' ||| ')[0];
        const assets = fp + u[i].split(' ||| ')[1];
        let cmd = 'open -a "Safari" "' + assets + '"';
        cnt++;
        await exec(cmd);
        if (cnt % 30 === 0) {
            let cmd = 'open -a "Safari" "https://www.youtube.com"';
            await exec(cmd);
            stop = prompt("stop processing ? ");
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();