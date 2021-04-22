const fs = require('fs');
const axios = require('axios');
const u = require('./u_official_no_assets');

(async () => {
    const fp = '/Users/lcchai/Work/assets/official/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        const uu = u[i].split('/');
        const fn = uu[uu.length - 1].split('?')[0];
        const fname = fp + fn;
        try {
            const resp = await axios.get(u[i], { responseType: 'stream' });
            resp.data.pipe(fs.createWriteStream(fname));
            const out = `${u[i]} ||| ${fname}`;
            console.log('     ', out);
            fs.appendFile('official_no_assets.out', out + '\n', (err) => { if (err) throw err; });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const out = `${u[i]}`;
                console.log('     404 : ', out)
                fs.appendFile('official_no_assets.err', out + '\n', (err) => { if (err) throw err; });
            } else {
                const out = `UNKNOWN : ${u[i]}`;
                console.log('     ', out)
                fs.appendFile('official_no_assets.err', out + '\n', (err) => { if (err) throw err; });
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})()