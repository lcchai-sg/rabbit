const util = require('util');
const exec = util.promisify(require('child_process').exec);
const u = require('./u_rolex');
const prompt = require('prompt-sync')();

(async () => {
    let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        const url = u[i].split(' | ')[0];
        const thm = u[i].split(' | ')[1];
        const ast = u[i].split(' | ')[2];
        let cmd = 'open -g -a safari "' + url + '"';
        await exec(cmd)
        cmd = 'open -g -a safari "' + thm + '"';
        await exec(cmd)
        cmd = 'open -g -a safari "' + ast + '"';
        await exec(cmd)
        if (i > 0 && i % 20 === 0) {
            stop = prompt("STOP processing? ");
        }
    }
    process.exit(0);
})();