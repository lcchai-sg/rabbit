const { Mappers } = require('./index');
const fs = require('fs').promises;
const no_match = [];

(async () => {
    const inp = await fs.readFile("joma_dial_color");
    const u = inp.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const r = Mappers.getColors.map(u[i]);
        let out = '';
        if (r) {
            console.log('r : ', r, r.length)
            let c = '';
            r.forEach(co => {
                c = c + co + ' / ';
            })
            out = u[i] + " || " + c + "\n";
        } else no_match.push(u[i]);
        if (out) fs.appendFile('norm_dial_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        fs.appendFile('norm_dial_color.txt', o + ', NOT MAPPED\n', (err) => { if (err) throw err });
    })
})();