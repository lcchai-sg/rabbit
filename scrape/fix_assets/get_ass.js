const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const fld = require('./folders');
const d = require('./u_assets');


(async () => {
    const fp = '/Users/lcchai/Work/assets/official/';
    for (let i = 0; i < d.length; i++) {
        try {
            const brand = d[i].split('||')[0];
            const url = d[i].split('||')[1].split('?')[0];
            console.log(`${i} / ${d.length}     brand : ${brand}     url : ${url}`);
            const imga = url.split('/');
            let fname = imga[imga.length - 1];
            if (!fname) fname = imga[imga.length - 2];
            const pname = fld[brand] ? fld[brand] : null;
            if (!pname) throw new err('no folder set up for the brand');
            const fldname = fp + pname;
            if (!fs.existsSync(fldname)) fs.mkdirSync(fldname, 0744);
            const filename = fp + pname + "/" + i + fname;
            console.log(`filename : ${filename}`);
            console.log();
            const resp = await axios.get(url, { responseType: 'stream', });
            resp.data.pipe(fs.createWriteStream(filename));
            const out = `db.reference_product.updateMany({thumbnail:'${url}'},{$set:{assets:${filename}}})\n`;
            fs.appendFile('output.txt', out, (err) => { if (err) throw err; });
        } catch (err) {
            console.log(err);
        }
    }
})()