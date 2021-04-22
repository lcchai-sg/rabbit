const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_armani_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/armani/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            await new Promise(r => setTimeout(r, 5000));
            const { data } = await axios.get(u[i]);
            const $ = cheerio.load(data);
            const ur = u[i].split('#')[0];
            const url = $('meta[property="og:url"]').attr('content');
            if (url.toLowerCase() !== ur.toLowerCase()) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 [red] : ${u[i]}`);
                console.log(`     404 [red] : ${url}`);
                fs.appendFile('armani_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                let th = '';
                $('script[type="application/ld+json"]').each((idx, el) => {
                    const j = JSON.parse($(el).contents().toString());
                    if (j.length) {
                        const jj = j[0];
                        if (jj.image) th = jj.image[0];
                    }
                })
                if (!th) th = $('meta[property="og:image"]').attr('content');
                if (!th.match(/https/i)) th = "https://www.armani.com" + th;
                if (th) {
                    th = th.split('?')[0];
                    const uu = th.split('/');
                    const fn = uu[uu.length - 1].split('?')[0];
                    const fname = fp + fn;
                    const resp = await axios.get(th, { responseType: 'stream', });
                    resp.data.pipe(fs.createWriteStream(fname));
                    const out = `${u[i]} ||| ${th} ||| ${fname}`;
                    console.log('     ', out);
                    fs.appendFile('armani_no_assets.out', out + '\n', (err) => { if (err) throw err; });
                } else {
                    const out = `${u[i]} ||| no thumbnail\n`;
                    console.log(`     NO THUMBNAIL : ${u[i]}`);
                    fs.appendFile('armani_no_assets.err', out, (err) => { if (err) throw err; });
                }
            }
        } catch (err) {
            if (err.response && (err.response.status === 404 || err.response.status === 410)) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('armani_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('armani_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()