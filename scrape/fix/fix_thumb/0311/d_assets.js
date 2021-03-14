const u = require('./a_del_addon');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const { MongoClient, } = require('mongodb');

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
    for (let i = 0; i < u.length; i++) {
        try {
            const r = await db.collection(mdb.coll).updateMany({ assets: u[i] }, { $unset: { assets: 1 } });
            console.log(u[i], '     matched : ', r.matchedCount, '       updated : ', r.modifiedCount);
            const cmd = 'curl --verbose --request DELETE https://synopsis.cosmos.ieplsg.com/files/' + u[i];
            const { stdout, stderr } = await exec(cmd);
            if (stdout.match(/HTTP\/2 202/i)) console.log(u.length, i, u[i], 'removed successful');
            else if (stdout.match(/HTTP\/2 404/i)) console.log(u.length, i, u[i], 'NOT FOUND');
            else console.log(u.length, i, stdout);
            if (stderr.match(/HTTP\/2 202/i)) console.log(u.length, i, u[i], 'removed successful');
            else if (stderr.match(/HTTP\/2 404/i)) console.log(u.length, i, u[i], 'NOT FOUND');
            else console.log(u.length, i, 'ERROR : ', stderr);
            await new Promise(r => setTimeout(r, 5000))
        } catch (error) {
            console.log(error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();
