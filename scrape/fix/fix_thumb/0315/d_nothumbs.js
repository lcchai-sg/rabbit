const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const fs = require('fs').promises;

(async () => {
    const mdb = {
        host: '192.168.200.227',
        port: 27017,
        user: 'synopsis',
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
    const data = await fs.readFile("upd_nothumbs.txt");
    const d = data.toString().split('\n');
    for (let i = 0; i < d.length && stop !== 'y'; i++) {
        const u = d[i].split(" ||| ")[0];
        const t = d[i].split(" ||| ")[1];
        const r = await db.collection(mdb.coll).updateMany({url:u}, {$set:{thumbnail:t}});
        console.log(`url : ${u}     thumb : ${t}     matched : ${r.matchedCount}     updated : ${r.modifiedCount}`)
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();