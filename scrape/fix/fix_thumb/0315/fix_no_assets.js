const { MongoClient } = require('mongodb');
const u = require('./no_assets');

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
        const p = await db.collection(mdb.coll).find({ url: u[i], assets: { $ne: null } }).sort({ laseCheckAt: -1 }).toArray();
        if (p && p.length > 0 && p[0]) {
            const r = await db.collection(mdb.coll).updateMany({ url: u[i], assets: null }, { $set: { assets: p[0] } });
            console.log(`${i} / ${u.length}    ${u[i]}   matched : ${r.matchedCount}   updated : ${r.modifiedCount}`);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();