const fs = require('fs').promises;
const { MongoClient } = require('mongodb');

(async () => {
    const mdb = {
        //host: '192.168.200.227',
        //user: 'productManager',
        //pass: 'UInJRX7m',
        //coll: 'reference_product',
        //
        host: '127.0.0.1',
        user: 'synopsis',
        pass: 'synopsis',
        coll: 'p_reference_product',
        //
        port: 27017,
        name: 'synopsis',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);

    try {
        const f = await fs.readFile('fix_mayfair.out');
        const d = f.toString().split('\n');
        for (let i = 0; i < d.length; i++) {
            const u = d[i].split(' ||| ')[0];
            const t = d[i].split(' ||| ')[1];
            if (u) {
                if (t === '404') {
                    const r = await db.collection(mdb.coll).updateMany({ url: u, thumbnail: null }, { $set: { code: 404 } });
                    console.log(`${i} / ${d.length} url : ${u}  [404]   matched : ${r.matchedCount}   updated : ${r.modifiedCount}`);
                } else {
                    const r = await db.collection(mdb.coll).updateMany({ url: u, thumbnail: null }, { $set: { thumbnail: t } });
                    console.log(`${i} / ${d.length} url : ${u}          matched : ${r.matchedCount}   updated : ${r.modifiedCount}`);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();