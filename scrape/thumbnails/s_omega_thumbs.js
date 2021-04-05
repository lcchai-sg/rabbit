const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_omega');
const fs = require('fs');

(async() => {
    for (let i = 0; i < u.length; i++) {
        try {
            const {data} = await axios.get(u[i]);
            const $ = cheerio.load(data);
            const imgF = data.match(/"full":"https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?.png"/ig);
            const img = data.match(/"img":"https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?.png"/ig);
            const imgTh = data.match(/"thumb":"https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?.png"/ig);
            let thumbnail = 'NOT FOUND';
            if (img) thumbnail = img[0].split(":")[1].replace(/"/g, "").trim();
            else if (imgTh) thumbnail = imgTh[0].split(":")[1].replace(/"/g, "").trim();
            else if (imgF) thumbnail = imgF[0].split(":")[1].replace(/"/g, "").trim();
            else thumbnail = $('meta[property="og:image"]').attr('content');
            const out = `${u[i]} ||| ${thumbnail}\n`;
            console.log(out);
            fs.appendFile('omega.out', out, (err) => { if (err) throw err; });
            await new Promise(r => setTimeout(r, 10000));
            if (i > 10) break;
        } catch (error) {
            console.error('error : ', error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();