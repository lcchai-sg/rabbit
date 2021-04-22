const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_citizen_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/citizen/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            await new Promise(r => setTimeout(r, 5000));
            const { data } = await axios.get(u[i]);
            const $ = cheerio.load(data);
            const url = $('link[rel="canonical"]').attr('href');
            if (url.toLowerCase() !== u[i].toLowerCase()) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('citizen_no_assets.err', out, (err) => { if (err) throw err; });
            }
            let th = 'https:' + $('.product-primary-image').find('img').attr('src');
            if (th) {
                // th = th.split('?')[0];
                const uu = th.split('?')[0].split('/');
                const fn = uu[5] + "_" + uu[uu.length - 1];
                const fname = fp + fn;
                const resp = await axios.get(th, { responseType: 'stream', });
                resp.data.pipe(fs.createWriteStream(fname));
                const out = `${u[i]} ||| ${th} ||| ${fname}`;
                console.log('     ', out);
                fs.appendFile('citizen_no_assets.out', out + '\n', (err) => { if (err) throw err; });
            } else {
                const out = `${u[i]} ||| no thumbnail\n`;
                console.log(`     NO THUMBNAIL : ${u[i]}`);
                fs.appendFile('citizen_no_assets.err', out, (err) => { if (err) throw err; });
            }
        } catch (err) {
            if (err.response && (err.response.status === 404 || err.response.status === 410)) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('citizen_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('citizen_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()