const { Mappers } = require('./index');
const fs = require('fs').promises;
const no_match = [];

(async () => {
    const inp = await fs.readFile("joma_case_material");
    const u = inp.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const { bm, } = Mappers.getMaterial.map(u[i]);
        let out = '';
        if (bm) out = u[i] + ' || ' + bm + '\n'; else no_match.push(u[i]);
        if (out) fs.appendFile('norm_case_material.csv', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        fs.appendFile('norm_case_material.csv', o + ', NOT MAPPED\n', (err) => { if (err) throw err });
    })
})();