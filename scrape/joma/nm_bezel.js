const { Mappers } = require('../utils');
const u = require('./n_bezel');

(async () => {
    const noMatch = [];
    for (let i = 0; i < u.length; i++) {
        const c = u[i].split(' | ')[0];
        const a = u[i].split(' | ')[1];
        const r = Mappers.getBezel.map(c);
        let out = '';
        if (r) {
            out = c + '|' + r + '|' + a;
            console.log(out);
        } else noMatch.push(c + '|NOT MAPPED|' + a);
    }
    console.log();
    noMatch.forEach(c => {
        console.log(c);
    })
    console.log();
    console.log('done.');
    process.exit(0);
})();