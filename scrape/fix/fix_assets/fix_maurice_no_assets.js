const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_maurice_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/maurice/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            await new Promise(r => setTimeout(r, 5000));
            const $ = cheerio.load((await axios.get(u[i])).data);
            let th = $('meta[property="og:image"]').attr('content');
            $('script[type="application/ld+json"]').each((idx, el) => {
                const c = $(el).contents().toString();
                const j = JSON.parse(c);
                if ((j['@type']) === 'Product') {
                    th = j.image ? j.image.replace(new RegExp('\/', 'g'), '/') : th;
                }
            })
            if (th) {
                th = th.split('?')[0];
                const uu = th.split('/');
                const fn = uu[uu.length - 1].split('?')[0];
                const fname = fp + fn;
                const resp = await axios.get(th, { responseType: 'stream', });
                resp.data.pipe(fs.createWriteStream(fname));
                const out = `${u[i]} ||| ${th} ||| ${fname}`;
                console.log('     ', out);
                fs.appendFile('maurice_no_assets.out', out + '\n', (err) => { if (err) throw err; });
            } else {
                const out = `${u[i]} ||| no thumbnail\n`;
                console.log(`     NO THUMBNAIL : ${u[i]}`);
                fs.appendFile('maurice_no_assets.err', out, (err) => { if (err) throw err; });
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('maurice_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('maurice_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()