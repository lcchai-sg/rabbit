const { MongoClient } = require('mongodb');
const axios = require('axios');
const u = require('./u_nothumbs');
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
            fs.appendFile('no_thumbs_update.out', out, (err) => { if (err) throw err; });
        } else {
            await new Promise(r => setTimeout(r, 3000));
            try {
                const { data } = await axios.get(u[i]);
                const out = `${u[i]}\n`
                fs.appendFile('no_thumbs_scrape.out', out, (err) => { if (err) throw err; });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    const out = `${u[i]} ||| 404\n`;
                    fs.appendFile('no_thumbs_update.out', out, (err) => { if (err) throw err; });
                } else console.log(error);
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();