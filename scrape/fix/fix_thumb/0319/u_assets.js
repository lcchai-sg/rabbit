const fs = require('fs').promises;
const { MongoClient } = require('mongodb');
const prompt = require('prompt-sync');

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
    const data = await fs.readFile("u_assets.txt");
    const u = data.toString().split('\n');
    let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        if (i % 1000 === 0) console.log(u.length, i);
        const url = u[i].split(' ||| ')[0];
        const assets = u[i].split(' ||| ')[1];
        const r = await db.collection(mdb.coll).updateMany({ url }, { $set: { assets } });
        const out1 = `url : ${url}      assets : ${assets}`;
        const out2 = `matched : ${r.matchedCount}       updated : ${r.modifiedCount}`;
        const out3 = '\n';
        fs.appendFile('u_assets.out', out1 + out3 + out2 + out3, (err) => { if (err) throw err });
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();