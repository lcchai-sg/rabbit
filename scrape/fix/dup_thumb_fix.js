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

  let prev = ""; let assets = []; let p_asset = "";
  for (let i = 0; i < u.length; i++) {
    const thumb = u[i].split("     ")[0].trim();
    const asset = u[i].split("     ")[1].replace("https://synopsis.cosmos.ieplsg.com/files/", "").trim();
    if (prev !== thumb) {
      if (assets.length > 0) {
        console.log(prev, ' >>> ', assets);
        console.log();
        console.log(`db.reference_product.find({thumbnail:'${prev}'}).map(r=>r.assets)`);
        console.log();
        console.log(`db.reference_product.updateMany({thumbnail:'${prev}', assets:{$ne:'${p_asset}'}},{$set:{thumbnail:'${p_asset}'}})`);
        console.log();
      }
      prev = thumb;
      p_asset = asset;
      assets = [];
      // assets.push("https://synopsis.cosmos.ieplsg.com/files/" + asset);
    } else assets.push(asset);
  }
})();