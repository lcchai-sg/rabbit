const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_seiko_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/seiko/';
    const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } };
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            await new Promise(r => setTimeout(r, 5000));
            let th = '';
            const uu = u[i].split('/');
            if (uu.length === 7) {
                const { data } = await axios.get(u[i], cfg);
                const $ = cheerio.load(data);
                const thumbnail = $(".okra-carousel-slide-inner").first().find("noscript").toString();
                th = thumbnail.split("=")[1].replace(/"/g, "").replace("alt", "").trim();
            } else if (uu.length === 9) {
                const link = "https://products.seikowatches.com/v1/products?format=json&locale=jp-en&id=" + uu[8];
                const { data } = await axios.get(link);
                const d = data.results ? data.results : [];
                if (d.length > 0) th = d[0].main_image;
            }
            if (th) {
                th = th.split('?')[0];
                const uu = th.split('/');
                const fn = uu[uu.length - 1].split('?')[0];
                const fname = fp + fn;
                const resp = await axios.get(th, { responseType: 'stream' });
                resp.data.pipe(fs.createWriteStream(fname));
                const out = `${u[i]} ||| ${th} ||| ${fname}`;
                console.log('     ', out);
                fs.appendFile('seiko_no_assets.out', out + '\n', (err) => { if (err) throw err; });
            } else {
                const out = `${u[i]} ||| no thumbnail\n`;
                console.log(`     NO THUMBNAIL : ${u[i]}`);
                fs.appendFile('seiko_no_assets.err', out, (err) => { if (err) throw err; });
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('seiko_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('seiko_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()