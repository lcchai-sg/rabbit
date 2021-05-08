const { MongoClient } = require('mongodb');
const fs = require('fs');
const u = require('./u_dup_urls');

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
        const p = await db.collection(mdb.coll).find({ url: u[i] }).toArray();
        console.log(u.length, i, u[i], p.length);
        const np = p[0];
        for (let j = 1; j < p.length; j++) {
            add_diff(np, p[j]);
        }
    }
})();