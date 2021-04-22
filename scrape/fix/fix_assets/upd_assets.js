const { MongoClient } = require('mongodb');
const fs = require('fs');
const fsp = fs.promises;

(async () => {
    const mdb = {
        host: '127.0.0.1',
        port: 27017,
        user: 'synopsis',
        pass: 'synopsis',
        name: 'synopsis',
        coll: 'reference_product',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);

    const n = 'armani_no_assets';
    const d = await fsp.readFile(n + '.out');
    if (d) {
        const dd = d.toString().split('\n');
        for (let i = 0; i < dd.length; i++) {
            const u = dd[i].split(' ||| ')[0];
            const t = dd[i].split(' ||| ')[1];
            const a = dd[i].split(' ||| ')[2];
            if (u && t && a) {
                const r = await db.collection(mdb.coll).updateMany({ url: u, assets: null }, { $set: { thumbnail: t, assets: a } });
                const out = `url : ${u}   matched : ${r.matchedCount}   updated : ${r.modifiedCount}`;
                console.log(out);
                fs.appendFile(n + '.txt', out + '\n', (err) => { if (err) throw err; });
            }
        }
    }
    if (fs.existsSync(n + '.err')) {
        const e = await fsp.readFile(n + '.err');
        if (e) {
            const ee = e.toString().split('\n');
            for (let i = 0; i < ee.length; i++) {
                const u = ee[i].split(' ||| ')[0];
                const er = ee[i].split(' ||| ')[1];
                if (u && er) {
                    let r;
                    if (er === '404') {
                        r = await db.collection(mdb.coll).updateMany({ url: u }, { $set: { code: 404 } });
                    } else {
                        r = await db.collection(mdb.coll).updateMany({ url: u }, { $set: { code: 'not product' } });
                    }
                    const out = `${er}   url : ${u}   matched : ${r.matchedCount}   updated : ${r.modifiedCount}`;
                    console.log(out);
                    fs.appendFile(n + '.err.txt', out + '\n', (err) => { if (err) throw err; });
                }
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();