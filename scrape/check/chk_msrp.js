const fs = require('fs').promises;
const { MongoClient } = require('mongodb');

(async () => {
    const mdb = {
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
        coll: "reference_product",
    }
    const mdb_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(mdb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const m_db = conn.db(mdb.name);

    const files = [
        'msrp.txt',
    ]

    for (let i = 0; i < files.length; i++) {
        const f = await fs.readFile(files[i]);
        const d = f.toString().split('\n');
        for (let j = 0; j < d.length; j++) {
            const id = parseInt(d[j].split('|')[1].replace(/\s+/, '').trim());
            const ref = d[j].split('|')[2].replace(/\s+/, '').trim();
            const retail = d[j].split('|')[3].replace(/\s+/, '').trim();
            try {
                const r = await m_db.collection(mdb.coll).find({ source: 'official', brandID: id, reference: ref }).sort({ lastCheckAt: -1 }).toArray();
                // const s = await m_db.collection(mdb.coll).find({ source: 'official', brandID: 350, reference: 'BQ2491' }).sort({ lastCheckAt: -1 }).toArray();
                if (r & r.length > 0) {
                    if (r[0].retail) {
                        console.log(`      ${id}     ${ref}      official : ${r[0].retail}          MSRP : ${retail}`);
                    } else {
                        console.log(`      ${id}     ${ref}      NO OFFICIAL RETAIL PRICE`);
                    }
                } else {
                    console.log(`     NOT FOUND : >${id}<     >${ref}<      ${retail}`);
                }
                console.log();
            } catch (error) {
                console.log('error reading data : ', error);
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();