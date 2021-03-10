const { MongoClient } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios');
const u = require('./joma_assets');

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
  // const p = await db.collection(mdb.coll).find({ thumbnail: { $exists: true }, assets: { $exists: true } }).toArray();
  // const p = u;
  // const base = "https://synopsis.cosmos.ieplsg.com/files/6,079dbd404e6e4f";
  const fs = "https://synopsis.cosmos.ieplsg.com/files/";
  // const { data: b } = await axios.get(base);
  for (let i = 0; i < u.length; i++) {
    try {
      const cmda = 'open -a "Google Chrome" "' + u[i] + '"';
      await exec(cmda);
      const { data: th } = await axios.get(u[i]);
      const p = await db.collection(mdb.coll).find({thumbnail:u[i]}).toArray();
      for (let j = 0; j < p.length; j++) {
        if (p[j].assets) {
          const cmda = 'open -a "Google Chrome" "https://synopsis.cosmos.ieplsg.com/files/' + p[j].assets + '"';
          await exec(cmda);
        }
      }
      await new Promise(r => setTimeout(r, 5000));
    } catch (error) {
      console.error('thumbnail : ', u[i]);
      console.error('error : ', error);
      console.log()
    }
  }
})();
