const { MongoClient } = require('mongodb');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();

(async () => {
  const mdb = {
    // production
    //host: '192.168.200.227',
    //port: 27017,
    //user: 'productManager',
    //pass: 'UInJRX7m',
    //name: 'synopsis',
    //coll: 'reference_raw',
    // local
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

  const u = await db.collection(mdb.coll).distinct("url", { thumbnail: null, code: { $nin: [404, 'not product'] } });
  let cnt = 0; let stop = '';
  for (let i = 0; i < u.length && stop !== 'y'; i++) {
    if (i % 100 === 0) console.log(u.length, i)
    if (u[i]) {
      const p = await db.collection(mdb.coll).distinct("thumbnail", { url: u[i] });
      if (p.length > 1) {
        p.sort();
        let updateAll = true;
        for (let j = 1; j < p.length && updateAll; j++) {
          if (p[j] && p[j] !== p[0]) {
            let cmd = 'open -a "Google Chrome" "' + u[i] + '"';
            await exec(cmd);
            cmd = 'open -a "Google Chrome" "' + p[0] + '"';
            await exec(cmd);
            cmd = 'open -a "Google Chrome" "' + p[j] + '"';
            await exec(cmd);
            const o = 'CANNOT update all > ' + u[i] + '   ' + p;
            fs.appendFile('chk_assets.out', o, (err) => { if (err) throw err; });
            updateAll = false;
            cnt++;
          }
        }
        if (updateAll) {
          console.log('update ', u[i], ' with ', p[0]);
          const o = 'update all : ' + u[i] + '   ' + p[0];
          fs.appendFile('upd_assets.out', o, (err) => { if (err) throw err; });
        }
      }
    }
    if (cnt > 0 && cnt % 20 === 0) {
      stop = prompt('stop processing ? ');
    }
  }
  console.log();
  console.log('done.');
  process.exit(0);
})();