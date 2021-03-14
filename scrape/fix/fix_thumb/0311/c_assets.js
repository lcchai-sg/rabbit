const { MongoClient } = require('mongodb');
const u = require('./a_del_addon');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
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
    let stop = ''; let cnt = 0;
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        try {
            const p = await db.collection(mdb.coll).find({ assets: u[i] }).toArray();
            if (p.length > 0) {
                console.log(u[i]);
                const asset = fs + u[i];
                try {
                    const { data } = await axios.get(asset);
                } catch (error) {
                    console.log('inner try... remove assets for 404');
                    if (error.response && error.response.status === 404) {
                        await db.reference_product.findOneAndUpdate({ assets: u[i] }, { $unset: { assets: 1 } })
                        console.log('    ', u[i], ' removed for db...');
                    }
                }
                const cmd = 'open -a "Google Chrome" "' + asset + '"';
                await exec(cmd);
                cnt++;
                if (cnt % 20 === 0) {
                    stop = prompt("stop processing ? ");
                }
            }
        } catch (err) {
            console.log('other try error : ', err);
        }
    }
    console.log();
    console.log("done.");
    process.exit(0);
})();
