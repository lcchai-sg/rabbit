const fs = require('fs');
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

  fs.readFile('u404.txt', async (err, data) => {
    if (err) throw err;
    const u = data.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
      // const cmd = `db.reference_product.updateMany({url: "${u[i]}"},{$set:{code:404}})\n`;
      // fs.appendFile('up_prod404.txt', cmd, (err) => { if (err) throw err; });
      try {
        const r = await db.collection(mdb.coll).updateMany({ url: u[i] }, { $set: { code: 404 } });
        console.log(`$u[i]     matched: ${r.matchedCount}   updated: ${r.modifiedCount}`);
      } catch (error) {
        console.log('error updating : ', error)
      }
    }
  })
})();