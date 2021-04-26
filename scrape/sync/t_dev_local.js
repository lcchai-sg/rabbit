const { MongoClient } = require('mongodb');
// const { Mappers } = require('./utils');
// const product = require('./joma_prod');

(async () => {
    try {
        const ddb = {
            host: "203.118.42.106",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
            coll: "p_reference_product",
        }
        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
            coll: "p_reference_product",
        }
        const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
        const d_conn = await MongoClient.connect(ddb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const d_db = d_conn.db(ddb.name);
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);

        const limit = 100000;
        for (let i = 0; i < 4; i++) {
            console.log('reading DB..........................')
            const r = await d_db.collection(ddb.coll).find().skip(i * limit).limit(limit).toArray();
            console.log('number of records : ', r.length, i)
            if (r.length > 0) {
                console.log('writing db..........................')
                await l_db.collection(ldb.coll).insertMany(r);
            }
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();
