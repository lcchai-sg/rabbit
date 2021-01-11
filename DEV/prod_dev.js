const { MongoClient } = require('mongodb');

(async function () {
    const pdb = {
      user: "productManager",
      pass: "UInJRX7m",
      host: "192.168.200.227",
      port: 27017,
      name: "synopsis",
      coll: "product",
    }
    const pdb_url = `mongodb://${pdb.user}:${pdb.pass}@${pdb.host}:${pdb.port}/${pdb.name}`;
    const pconn = await MongoClient.connect(pdb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const p_db = pconn.db(pdb.name);

    const ddb = {
      user: "synopsis",
      pass: "synopsis",
      host: "203.118.42.106",
      port: 27017,
      name: "synopsis",
      coll: "product_demo",
    }
    const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
    const dconn = await MongoClient.connect(ddb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const d_db = dconn.db(ddb.name);

    const p = await p_db.collection(pdb.coll).find({isVerified: 1}).toArray();
    console.log('products >', p.length);
    for (let i = 0; i < p.length; i++) {
      try {
      delete p[i]["dial.color"];
      await d_db.collection(ddb.coll).insertOne(p[i]);
      //for (let i=0; i<p.length; i++) {
      //  console.log(k, p.length, i);
      //  await d_db.collection(ddb.coll).insertOne(p[i]);
      //}
      } catch(e) {
        console.log('error > ', p[i]._id);
        console.log(e);
      }
    }
  console.log('*** done ***');
  process.exit(0);
})();
