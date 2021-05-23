const { Mappers } = require('./index');
const fr = require('fs').promises;
const fs = require('fs');

(async () => {
    let ws = fs.createWriteStream('norm_color.txt', { flags: 'w' });

    let inp = await fr.readFile("joma_band_color");
    let u = inp.toString().split('\n');
    let no_match = [];
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
            out = u[i] + " | " + c + " | band.color\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED\n');
    })

    inp = await fr.readFile("joma_bezel_color");
    u = inp.toString().split('\n');
    no_match = [];
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
            out = u[i] + " | " + c + " | bezel.color\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED\n');
    })

    inp = await fr.readFile("joma_dial_color");
    u = inp.toString().split('\n');
    no_match = [];
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
            out = u[i] + " | " + c + " | dial.color\n";
        } else no_match.push(u[i]);
        if (out) ws.write(out);
        // if (out) fs.appendFile('norm_color.txt', out, (err) => { if (err) throw err });
    }
    no_match.forEach(o => {
        ws.write(o + ', NOT MAPPED\n');
    })

    ws.close();
})();