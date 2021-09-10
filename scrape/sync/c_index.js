const { MongoClient } = require('mongodb');

(async () => {
    try {
        const ddb = {
            host: "203.118.42.106",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        };

        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        }

        const exist = (col, item) => {
            let result = false;
            col.forEach(c => {
                if (c.name == item.name && c.type == item.type) result = true;
            })
            return result;
        }

        const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
        const d_conn = await MongoClient.connect(ddb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const d_db = d_conn.db(ddb.name);
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);
        const d_col = await d_db.listCollections().toArray();
        const l_col = await l_db.listCollections().toArray();
        for (let i = 0; i < d_col.length; i++) {
            const c = d_col[i];
            const idx = await d_db.collection(c.name).listIndexes().toArray();
            for (let i = 0; i < idx.length; i++) {
                const ci = idx[i];
                if (ci.name !== '_id_') {
                    const unq = ci.unique ? ci.unique : null;
                    const r = await l_db.collection(c.name).createIndex(ci.key, unq);
                    console.log(c.name, r);
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
    console.log();
    console.log('done.....');
    process.exit(0);
})()
