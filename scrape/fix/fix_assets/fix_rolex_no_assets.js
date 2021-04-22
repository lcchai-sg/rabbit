const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_rolex_no_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/rolex/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            await new Promise(r => setTimeout(r, 5000));
            const link = u[i].replace(".html", ".model.json");
            const { data } = await axios.get(link);
            const j = JSON.parse(JSON.stringify(data));
            let th = '';
            if (j['pageProperties'] && j['pageProperties']['modelpage'] && j['pageProperties']['modelpage']['rmc']) {
                th = j['pageProperties']['metaData']['og:image'];
            }
            th = th.replace(/\/2020\//, '/2021/').split('?')[0];
            if (th) {
                th = th.split('?')[0];
                const uu = th.split('/');
                const fn = uu[uu.length - 1].split('?')[0];
                const fname = fp + fn;
                const resp = await axios.get(th, { responseType: 'stream' });
                resp.data.pipe(fs.createWriteStream(fname));
                const out = `${u[i]} ||| ${th} ||| ${fname}`;
                console.log('     ', out);
                fs.appendFile('rolex_no_assets.out', out + '\n', (err) => { if (err) throw err; });
            } else {
                const out = `${u[i]} ||| no thumbnail\n`;
                console.log(`     NO THUMBNAIL : ${u[i]}`);
                fs.appendFile('rolex_no_assets.err', out, (err) => { if (err) throw err; });
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('rolex_no_assets.err', out, (err) => { if (err) throw err; });
            } else {
                console.log(err);
                const out = `${u[i]} ||| error\n`;
                console.log(`     ERROR : ${u[i]}`);
                fs.appendFile('rolex_no_assets.err', out, (err) => { if (err) throw err; });
            }
        }
    }
})()