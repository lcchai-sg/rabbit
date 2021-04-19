const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_fossil_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/fossil/';
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
                fs.appendFile('fossil_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                let th = '';
                $('script[type="application/ld+json"]').each((idx, el) => {
                    const d = $(el).contents().toString().replace(/&lt;br&gt;/ig, "");
                    if (d.match(/"@type": "Product"/)) {
                        const image = d.match(/"image": \[".*"\]/g);
                        const img = image ? image[0].split(":") : null;
                        if (img) th = JSON.parse(img.slice(1, img.length).join(":"))[0];
                    }
                })
                if (th) {
                    // th = th.split('?')[0];
                    const uu = th.split('/');
                    const fn = uu[uu.length - 1].split('?')[0];
                    const fname = fp + fn;
                    const resp = await axios.get(th, { responseType: 'stream', });
                    resp.data.pipe(fs.createWriteStream(fname));
                    const out = `${u[i]} ||| ${th} ||| ${fname}`;
                    console.log('     ', out);
                    fs.appendFile('fossil_no_assets.out', out + '\n', (err) => { if (err) throw err; });
                } else {
                    const out = `${u[i]} ||| no thumbnail\n`;
                    console.log(`     NO THUMBNAIL : ${u[i]}`);
                    fs.appendFile('fossil_no_assets.err', out, (err) => { if (err) throw err; });
                }
            }
        } catch (err) {
            if (err.response && (err.response.status === 404 || err.response.status === 410)) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('fossil_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('fossil_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()