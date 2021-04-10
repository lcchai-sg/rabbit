const { MongoClient } = require('mongodb');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./u_ptime');
const fs = require('fs');

(async () => {
    const mdb = {
        host: '127.0.0.1',
        port: 27017,
        user: 'synopsis',
        pass: 'synopsis',
        name: 'synopsis',
        coll: 'p_reference_product',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        const p = await db.collection(mdb.coll).find({ url: u[i], thumbnail: { $ne: null } }).sort({ lastCheckAt: -1 }).toArray();
        if (p && p.length > 0 && p[0]) {
            const out = `${u[i]} ||| ${p[0].thumbnail}\n`
            fs.appendFile('fix_ptime.out', out, (err) => { if (err) throw err; });
        } else {
            await new Promise(r => setTimeout(r, 3000));
            const { data } = await axios.get(u[i]);
            const $ = cheerio.load(data);
            const url = $('link[rel="canonical"]').attr('href');
            if (url !== u[i]) {
                const out = `${u[i]} ||| 404\n`;
                fs.appendFile('fix_ptime_404.out', out, (err) => { if (err) throw err; });
            } else {
                let th = '';
                if (u[i].match(/preown/i)) {
                    th = "https://www.prestigetime.com" + $('#main-img').find('a').attr('href');
                } else {
                    if (!(data.match(/watch detail/i))) {
                        const out = `${u[i]} ||| not product\n`;
                        fs.appendFile('fix_ptime_404.out', out, (err) => { if (err) throw err; });
                    } else {
                        th = $('.lb-image-link img').attr('src');
                    }
                }
                if (th) {
                    if (th.match(/placeholder|coming/i)) {
                        console.log(`          ${u[i]} no image`)
                    } else {
                        const out = `${u[i]} ||| ${th}\n`;
                        fs.appendFile('fix_ptime_404.out', out, (err) => { if (err) throw err; });
                    }
                }
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();