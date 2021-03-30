const axios = require('axios');
const u = require('./u404');
const { MongoClient } = require('mongodb');
const fs = require('fs');

(async () => {
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

  for (let i = 0; i < u.length; i++) {
    console.log(u.length, i, u[i])
    try {
      const { data } = await axios.get(u[i]);
      const out = '"' + u[i] + '"\n';
      fs.appendFile('u404_ok.txt', out, (err) => { if (err) throw err; });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const r = await db.collection(mdb.coll).updateMany({ url: u[i] }, { $set: { code: 404 } });
        const out = `U: ${u[i]}     M: ${r.matchedCount}     U: ${r.modifiedCount}`
        fs.appendFile('u404.out', out, (err) => { if (err) throw err; });
      } else console.log(error);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
})();