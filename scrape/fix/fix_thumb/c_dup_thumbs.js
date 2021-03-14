const { MongoClient, } = require('mongodb');
const u = require('./dup_thumbs');

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

    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        try {
            const p = await db.collection(mdb.coll).distinct("assets", { thumbnail: u[i] });
            if (p.length > 1) console.log(u[i], p);
        } catch (error) {
            console.error(error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();
