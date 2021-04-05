const { MongoClient, } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./u_nothumbs');
const fs = require('fs');

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
    const fp = "https://synopsis.cosmos.ieplsg.com/files/";
    let cnt = 0; let stop = '';
    for (let i = 0; i < u.length && stop !== 'y'; i++) {
        // const cmd = 'open -g -a "Safari" "' + u[i] + '"';
        // await exec(cmd);
        // const a = await db.collection(mdb.coll).distinct("assets", { url: u[i], assets: { $ne: null } })
        // if (a && a.length > 0) {
        //     console.log('assets : ', a[0])
        //     const cmda = 'open -g -a "Safari" "' + fp + a[0] + '"';
        //     await exec(cmda);
        // }
        const th = await db.collection(mdb.coll).distinct("thumbnail", { url: u[i], thumbnail: { $ne: null } });
        if (th && th.length > 0) {
            // console.log('thumbnail : ', th[0])
            // const cmdth = 'open -g -a "Safari" "' + th[0] + '"';
            // await exec(cmdth);
            if (th[0]) {
                const out = `${u[i]} ||| ${th[0]}\n`;
                fs.appendFile("upd_nothumbs.txt", out, (err) => { if (err) throw err; });
            }
        }
        // const upd = prompt("update thumbnail ? ");
        // if (upd === 'y') {
        //     const r = await db.collection(mdb.coll).updateMany({ url: u[i] }, { $set: { thumbnail: th[0] } });
        //     console.log(`${u[i]}     matched: ${r.matchedCount}     updated: ${r.modifiedCount}`);
        //     const out = u[i] + "|||" + th[0] + "\n";
        //     fs.appendFile("upd_nothumbs.txt", out, (err) => { if (err) throw err; });
        // }
        // cnt++;
        // if (cnt % 30 === 0) {
        //     stop = prompt('end processing ? ');
        // }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();