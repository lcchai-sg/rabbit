const { MongoClient } = require('mongodb');
const u = require('./prod404');

(async () => {
    const mdb = {
        host: "127.0.0.1",
        port: 27017,
        user: "synopsis",
        pass: "synopsis",
        name: "synopsis",
        coll: "reference_product",
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url,
        { useNewUrlParser: true, useUnifiedTopology: true, });
    const db = conn.db(mdb.name);
    for (let i = 0; i < u.length; i++) {
        try {
            console.log(u[i]);
            await db.collection(mdb.coll).updateMany({ url: u[i] }, { $set: { code: 404, lastExtraction: new Date() } })
        } catch (error) {
            console.log(error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();