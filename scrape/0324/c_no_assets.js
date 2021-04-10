const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const u = require('./no_assets');

(async () => {
    const mdb = {
        host: '192.168.200.227',
        port: 27017,
        user: 'productManager',
        pass: 'UInJRX7m',
        name: 'synopsis',
        coll: 'reference_product',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);

    for (let i = 0; i < u.length; i++) {
        const a = await db.collection(mdb.coll).distinct("assets", { url: u[i] });
        if (a.length > 1) {
            a.sort();
            // const out = `${u[i]}   matched: ${r.matchedCount}   updated: ${r.modifiedCount}`;
            const out = `url : ${u[i]}      assets: ${a[0]}`;
            console.log(out);
            // fs.appendFile('up_no_assets.out', out + '\n', (err) => { if (err) throw err; });
        } else {
            const out = `url : ${u[i]}      assets : ${a}`;
            console.log(out);
            // fs.appendFile('no_assets.out', out + '\n', (err) => { if (err) throw err; })
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();