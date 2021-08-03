#!/usr/local/bin/node
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cfg = require('./cfg');

(async () => {
    const c = Object.keys(cfg);
    for (let i = 0; i < c.length; i++) {
        if (!cfg[c[i]].stopuse) {
            console.log(c.length, i, c[i]);
            const cmd = './prodsub.sh -b ' + c[i] + ' -c indexing';
            console.log('         ', cmd);
        }
    }
})();
