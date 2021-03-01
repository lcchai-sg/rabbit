const u = require('./dup_thumb_out');
const { MongoClient } = require('mongodb');

(async () => {
  // const mdb = {
  //   host: '192.168.200.227',
  //   port: 27017,
  //   user: 'productManager',
  //   pass: 'UInJRX7m',
  //   name: 'synopsis',
  //   coll: 'reference_product',
  // };

  // const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  // const conn = await MongoClient.connect(db_url, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  // const db = conn.db(mdb.name);

  let prev = "";
  for (let i = 0; i < u.length; i++) {
    const thumb = u[i].split("     ")[0].trim();
    const asset = u[i].split("     ")[1].trim();
    if (prev !== thumb) {
      console.log(thumb);
      console.log("     ", asset)
      prev = thumb;
    }
  }
})();