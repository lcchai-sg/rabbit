const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./placeholder');
const { MongoClient } = require('mongodb');

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

    for (let i = 0; i < u.length; i++) {
        const r = await db.collection(mdb.coll).updateMany({ assets: u[i] }, { $set: { assets: null, updatedBy: 'LCC', updatedOn: new Date() } });
        const out = `assets : ${u[i]}     matched : ${r.matchedCount}     updated : ${r.modifiedCount}\n`;
        fs.appendFile('d_placeholder.out', out, (err) => { if (err) throw err });
        const cmd = 'curl --verbose --request DELETE https://synopsis.cosmos.ieplsg.com/files/' + u[i];
        const { stdout, stderr } = await exec(cmd);
        if (stdout.match(/202 Accepted/i)) console.log(u.length, i, u[i], 'removed successful');
        else if (stdout.match(/404 Not Found/i)) console.log(u.length, i, u[i], 'NOT FOUND');
        else console.log(u.length, i, stdout);
        if (stderr.match(/202 Accepted/i)) console.log(u.length, i, u[i], 'removed successful');
        else if (stderr.match(/404 Not Found/i)) console.log(u.length, i, u[i], 'NOT FOUND');
        else console.log(u.length, i, 'ERROR : ', stderr);
        await new Promise(r => setTimeout(r, 1000))
    }
    // let stop = ''; let cnt = 0;
    // for (let i = 0; i < u.length && stop !== 'y'; i++) {
    //     let cmd = 'open -a "Safari" "' + fp + u[i] + '"';
    //     await exec(cmd);
    //     if (i > 0 && i % 50 === 0) {
    //         stop = prompt("stop processing ? ");
    //     }
    // }

    console.log();
    console.log('done.');
    process.exit(0);
})();