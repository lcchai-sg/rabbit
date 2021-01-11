const { MongoClient } = require('mongodb');

(async function () {
    const ddb = {
      user: "synopsis",
      pass: "synopsis",
      host: "203.118.42.106",
      port: 27017,
      name: "synopsis",
      coll: "p_reference_product",
    }
    const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
    const dconn = await MongoClient.connect(ddb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const d_db = dconn.db(ddb.name);
    console.log('dev connected.');

    const ldb = {
      user: "synopsis",
      pass: "synopsis",
      host: "127.0.0.1",
      port: 27017,
      name: "synopsis",
      coll: "d_reference_product",
    }
    const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
    const lconn = await MongoClient.connect(ldb_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const l_db = lconn.db(ldb.name);
    console.log('local connected.');

    console.log('..... reading db .....');
    const limit = 100000;
    for (let i = 0; i < 4; i++) {
      const p = await d_db.collection(ddb.coll).find().skip(i*limit).limit(limit).toArray();
      try {
        console.log('.....writing db.....');
        await l_db.collection(ldb.coll).insertMany(p);
      } catch(e) {
        console.log('error > ', e);
      }
    }
    console.log('*** done ***');
    process.exit(0);
})();
