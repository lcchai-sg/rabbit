const axios = require('axios');
const { MongoClient, } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();
const u = require('./assets');

(async() => {
  const mdb = {
    host: '192.168.200.227',
    port: 27017,
    user: 'productManager',
    pass: 'synopsis',
    name: 'UInJRX7m',
    coll: 'reference_product',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const base = "https://synopsis.cosmos.ieplsg.com/files/5,03134a0f005375";
  const base1 = "https://synopsis.cosmos.ieplsg.com/files/5,04165f75309101";
  const fs = "https://synopsis.cosmos.ieplsg.com/files/";
  const {data: b} = await axios.get(base);
  const {data: b1} = await axios.get(base1);
  let cnt = 0; const chk = []; const to_del = [];
  for (let i = 0; i < u.length; i++) {
    const {data:c} = await axios.get(fs + u[i]);
    if (b === c || b1 === c) {
      to_del.push(u[i]);
      // const r = await db.collection(mdb.coll).updateMany({assets: u[i]},{$unset:{assets:1}});
      // if (r) console.log(`update db result, matched: ${r.matchedCount}, updated: ${r.modifiedCount}`);
    }
  }
  console.log('to delete :');
  to_del.forEach(a => console.log('     ', a));
  console.log();
  console.log('done.');
  process.exit(0);
})();
