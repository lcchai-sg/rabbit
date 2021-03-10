const { MongoClient } = require('mongodb');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios');
const u = require('./jo_th');
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

  const base = "https://cdn2.jomashop.com/media/catalog/product/cache/bd69c9f438c854e0d2d88b4657bdd9c3/t/a/tag-heuer-link-mens-watch-cjf2111ba0594-cjf2111ba0594.jpg";
  const fs = "https://synopsis.cosmos.ieplsg.com/files/";
  const { data: b } = await axios.get(base);
  let stop = ''; let cnt = 0;
  for (let i = 0; i < u.length && stop !== 'y'; i++) {
    cnt++;
    try {
      const cmda = 'open -a "Google Chrome" "' + u[i] + '"';
      await exec(cmda);
      // console.log(u[i])
      // const { data: th } = await axios.get(u[i]);
      // const p = await db.collection(mdb.coll).find({thumbnail:u[i]}).toArray();
      // for (let j = 0; j < p.length; j++) {
      //   if (p[j].assets) {
      //     const cmda = 'open -a "Google Chrome" "https://synopsis.cosmos.ieplsg.com/files/' + p[j].assets + '"';
      //     await exec(cmda);
      //   }
      // }
      if (cnt % 50 === 0) {
        stop = prompt("stop processing ? ");
      }
    } catch (error) {
      console.error('thumbnail : ', u[i]);
      console.error('error : ', error);
      console.log()
    }
  }
  console.log()
  console.log('done.')
  process.exit(0)
})();
