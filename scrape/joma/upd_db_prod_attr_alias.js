const fs = require('fs').promises;
const { MongoClient } = require('mongodb');

(async () => {
    const ddb = {
        // prod
        // user: "productManager",
        // pass: "UInJRX7m",
        // host: "192.168.200.227",
        // dev
        user: "synopsis",
        pass: "synopsis",
        // host: "203.118.42.106",
        host: "127.0.0.1",
        port: 27017,
        name: "synopsis",
        coll: "alias",
    }
    const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
    const dconn = await MongoClient.connect(ddb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const d_db = dconn.db(ddb.name);

    const files = [
        // 'nmc_buckle.csv',
        // 'nmc_color.csv',
        // 'nmc_materials.csv',
        'nmc_bezel.csv'
    ]

    for (let i = 0; i < files.length; i++) {
        const f = await fs.readFile(files[i]);
        const d = f.toString().split('\n');
        console.log(files[i], '          count : ', d.length);
        for (let j = 0; j < d.length; j++) {
            const k = d[j].split('|')[2].replace(/\s+/, '').trim();
            const kind = k.match(/color/i) ? 'color' :
                k.match(/material/i) ? 'material' :
                    k.match(/buckle/i) ? 'buckle' :
                        k.match(/bezel/i) ? 'bezel' :
                            null;
            const value = d[j].split('|')[1];
            const alias = d[j].split('|')[0];
            try {
                // if (kind) await d_db.collection(ddb.coll).insertOne({ kind, value, alias, });
                if (kind && value !== 'NOT MAPPED') {
                    let r = await d_db.collection(ddb.coll).findOneAndUpdate(
                        { kind, value, alias },
                        { $set: { 'updatedBy': 'LCC', updatedOn: new Date() }, },
                        { upsert: true }
                    );
                    // console.log(r);
                }
                // await new Promise(r => setTimeout(r, 1000))
            } catch (error) {
                console.log('error inserting data : ', error);
            }
        }
    }
    console.log('done.');
    process.exit(0);
})();