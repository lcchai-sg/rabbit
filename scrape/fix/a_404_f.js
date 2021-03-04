const { MongoClient } = require('mongodb');
const axios = require('axios');
const cheerio = require('cheerio');
const u = require('./jo_th');

(async() => {
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

  for (let i = 0; i < u.length; i++) {
    console.log(u.length, i, u[i]);
    await db.collection(mdb.coll).updateMany({assets: u[i]},{$unset:{assets:1}});
  }
  console.log();
  console.log("done.");
  process.exit(0);
})();
