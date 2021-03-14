const { MongoClient, } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./assets');
const axios = require('axios');

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
    const fs = "https://synopsis.cosmos.ieplsg.com/files/";
    let cnt = 0; let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        const p = await (await db.collection(mdb.coll).distinct("assets", { thumbnail: u[i] })).sort();
        if (p.length > 1) {
            p.forEach(a => {
                if (a && a !== p[0]) console.log('"' + a + '",');
            })
            // const th = u[i].replace(/\s+/g, '%20');
            // const cmdjpg = 'open -a "Google Chrome" "' + th + '"';
            // await exec(cmdjpg);
            // const asset = fs + p[0];
            // const cmda = 'open -a "Google Chrome" "' + asset + '"';
            // await exec(cmda);
            // cnt++;
            // if (cnt > 0 && cnt % 50 === 0) {
            //     stop = prompt("stop processing ? ");
            // }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();