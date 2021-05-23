const { Mappers } = require('./index');
const fr = require('fs').promises;
const fs = require('fs');

(async () => {
    let ws = fs.createWriteStream('norm_materials.txt', { flags: 'w' });

    let inp = await fr.readFile("joma_band_material");
    let u = inp.toString().split('\n');
    let no_match = [];
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const { bms, } = Mappers.getMaterial.map(u[i]);
        let out = '';
        if (bms) {
            console.log('bms : ', bms, bms.length)
            let c = '';
            bms.forEach(co => {
                c = c + co + ' / ';
            })
            out = u[i] + " | " + c + " | band.material\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED | band.mateial\n');
    })

    inp = await fr.readFile("joma_bezel_material");
    u = inp.toString().split('\n');
    no_match = [];
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const { bms, } = Mappers.getMaterial.map(u[i]);
        let out = '';
        if (bms) {
            console.log('bms : ', bms, bms.length);
            let c = '';
            bms.forEach(co => {
                c = c + co + ' / ';
            })
            out = u[i] + " | " + c + " | bezel.material\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED | bezel.material\n');
    })

    inp = await fr.readFile("joma_case_material");
    u = inp.toString().split('\n');
    no_match = [];
    for (let i = 0; i < u.length; i++) {
        console.log(`${u.length}   ${i}     ${u[i]}`);
        const { bms, } = Mappers.getMaterial.map(u[i]);
        let out = '';
        if (bms) {
            console.log('bms : ', bms, bms.length)
            let c = '';
            bms.forEach(co => {
                c = c + co + ' / ';
            })
            out = u[i] + " | " + c + " | case.material\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED | case.material\n');
    })

    ws.close();
})();