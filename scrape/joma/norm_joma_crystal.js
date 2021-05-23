const { Mappers } = require('./index');
const fs = require('fs').promises;
const no_match = [];

(async () => {
    const inp = await fs.readFile("joma_crystal");
    const u = inp.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        let out = '';
        const c = Mappers.getCrystal.map(u[i]);
        if (c) out = u[i] + ' | ' + c + '\n'; else no_match.push(u[i]);
        if (out) fs.appendFile('norm_crystal.csv', out, (err) => { if (err) throw err });
        const cc = Mappers.getCrystalCoating.map(u[i]);
        if (cc) {
            out = u[i] + ' | ' + cc + '\n';
            fs.appendFile('norm_crystal_coating.csv', out, (err) => { if (err) throw err });
        }
    }
    if (no_match.length > 0) {
        fs.appendFile('norm_crystal.csv', '\n', (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        fs.appendFile('norm_crystal.csv', o + ', NOT MAPPED\n', (err) => { if (err) throw err });
    })
})();