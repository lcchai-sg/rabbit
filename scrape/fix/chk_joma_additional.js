const { MongoClient } = require('mongodb');

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
    const p = await db.collection(mdb.coll).aggregate([{ $match: { source: "jomashop", code: { $nin: [404, 'not product'] } } }, { $group: { _id: "$url", lastCheck: { $max: "$lastCheckAt" } } }]).toArray();
    for (let i = 0; i < p.length; i++) {
        console.log(p.length, i, p[i]._id, p[i].lastCheck);
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();
