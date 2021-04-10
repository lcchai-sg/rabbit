const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

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

    const d = await fs.readFile("u404.txt");
    const dd = d.split('/n');
    for (let i = 0; i < dd.length; i++) {
        const r = await db.collection(mdb.coll).updateMany({ url: dd[i] }, { $set: { code: 404, updatedBy: 'LCC', updatedOn: new Date() } });
        const out = `${dd[i]}   matched: ${r.matchedCount}   updated: ${r.modifiedCount}`;
        console.log(out);
        fs.appendFile('u404.out', out + '\n', (err) => { if (err) throw err; });
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();