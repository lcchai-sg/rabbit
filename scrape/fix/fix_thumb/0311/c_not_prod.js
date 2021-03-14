const u = require('./not_prod_assets');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();

(async () => {
    let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        try {
            console.log('   ', u[i]);
            const cmdurl = 'open -a "Google Chrome" "' + u[i] + '"';
            await exec(cmdurl);
        } catch (error) {
            console.error(error);
        }
        if (i > 0 && i % 30 === 0) {
            stop = prompt('stop processing ? ');
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();
