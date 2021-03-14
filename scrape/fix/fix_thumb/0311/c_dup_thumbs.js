const { MongoClient, } = require('mongodb');
const u = require('./dup_thumbs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();

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
    let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        try {
            const p = await db.collection(mdb.coll).distinct("assets", { thumbnail: u[i] });
            if (p.length > 1) {
                console.log('   ', u[i], p);
                const cmdurl = 'open -a "Google Chrome" "' + u[i] + '"';
                await exec(cmdurl);
                for (let i = 0; i < p.length; i++) {
                    const asset = fs + p[i];
                    const cmda = 'open -a "Google Chrome" "' + asset + '"';
                    await exec(cmda);
                }
            }
        } catch (error) {
            console.error(error);
        }
        if (i > 0 && i % 20 === 0) {
            stop = prompt('stop processing ? ');
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();
