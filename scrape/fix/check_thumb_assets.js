// const { MongoClient } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios');
const u = require('./thumb_assets');

(async () => {
  // const mdb = {
  //   host: '127.0.0.1',
  //   port: 27017,
  //   user: 'synopsis',
  //   pass: 'synopsis',
  //   name: 'synopsis',
  //   coll: 'p_reference_product',
  // };

  // const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  // const conn = await MongoClient.connect(db_url, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  // const db = conn.db(mdb.name);
  // const p = await db.collection(mdb.coll).find({ thumbnail: { $exists: true }, assets: { $exists: true } }).toArray();
  const p = u;
  const base = "https://synopsis.cosmos.ieplsg.com/files/6,079dbd404e6e4f";
  const fs = "https://synopsis.cosmos.ieplsg.com/files/";
  const { data: b } = await axios.get(base);
  for (let i = 0; i < p.length; i++) {
    console.log(p.length, i);
    if (p[i].thumbnail && p[i].assets) {
      try {
        const { data: th } = await axios.get(p[i].thumbnail);
        const { data: a } = await axios.get(fs + p[i].assets);
        if (th === a) {}
        else {
          console.log('thumbnail NOT SAME AS asset');
          console.log('      ', p[i].thumbnail);
          console.log('      ', fs + p[i].assets);
          console.log();
          const cmdth = 'open -a "Google Chrome" "' + p[i].thumbnail + '"';
          await exec(cmdth);
          const cmda = 'open -a "Google Chrome" "https://synopsis.cosmos.ieplsg.com/files/' + p[i].assets + '"';
          await exec(cmda);
          await new Promise(r => setTimeout(r, 5000));
        }
        if (b == th) {
          console.log('thumbnail is PLACEHOLDER');
          console.log('.....', p[i].thumbnail)
          if (th == a) {
            console.log('assets is PLACEHOLDER');
            console.log('.....', fs + p[i].assets);
          }
        }
      } catch (error) {
        console.error('error : ', error);
        console.error('thumbnail : ', p[i].thumbnail);
        console.error('assets : ', fs + p[i].assets)
        console.log()
      }
    }
  }
})();
