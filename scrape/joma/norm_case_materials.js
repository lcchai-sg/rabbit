const { Mappers } = require('./index');
const fs = require('fs').promises;
const no_match = [];

(async () => {
    const inp = await fs.readFile("joma_case_material");
    const u = inp.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const { bm, bms, } = Mappers.getMaterial.map(u[i]);
        if (bm) {
            let ms = '';
            bms.forEach(m => { ms = ms + m + ' / '; })
            const out = u[i] + ' || ' + ms + '\n';
            fs.appendFile('norm_case_materialS.txt', out, (err) => { if (err) throw err });
        } else no_match.push(u[i]);
    }
    no_match.forEach(o => {
        fs.appendFile('norm_case_materialS.txt', o + ', NOT MAPPED\n', (err) => { if (err) throw err });
    })
})();