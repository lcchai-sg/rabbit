const { MongoClient } = require('mongodb');

(async () => {
  const mdb = {
    host: "192.168.200.227",
    port: 27017,
    user: "productManager",
    pass: "UInJRX7m",
    name: "synopsis",
    //coll: "product",
    coll: "reference_product",
    //user: 'synopsis',
    //pass: 'synopsis',
    //host: '203.118.42.106',
    //coll: 'reference_product_0312',
    //coll: 'reference_urls',
    //coll: 'product_jewellery',
    //coll: 'product',
    //port: 27017,
    //name: 'synopsis',
    //user: 'root',
    //pass: 'sysadmin',
    //host: '127.0.0.1',
    //coll: 'product',
  };
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useUnifiedTopology: true,
  });
  let fields = [];
  console.log("***** processing data *****");

  const listFields = (obj, parent) => {
    for (key in obj) {
      if (key !== '_id') {
        cKey = parent + '.' + key;
        if (fields.indexOf(cKey) < 0) {
          fields.push(cKey);
        }
        if (typeof obj[key] === 'object') {
          listFields(obj[key], cKey);
        }
      }
    }
  }

  try {
    let result = await conn
      .db(mdb.name)
      .collection(mdb.coll)
      // .findOne({ id: 10002 })
      .find()
      .toArray();
    // console.log(result)
    // process.exit(0)
    for (let i = 0; i < result.length; i++) {
      listFields(result[i], '');
    }
    fields.sort();
    fields.forEach(val => console.log(val));
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
