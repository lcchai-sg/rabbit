const { MongoClient, } = require('mongodb');
const u = require('./dup_thumb');

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
  for (let i = 0; i < u.length; i++) {
    const t = u[i].split("   ")[0];
    const p = await db.collection(mdb.coll).find({ thumbnail: t }).toArray();
    for (let j = 0; j < p.length; j++) {
      console.log(p[j].url, "https://synopsis.cosmos.ieplsg.com/files/" + p[j].assets);
    }
  }
  console.log();
  console.log("done.");
})();