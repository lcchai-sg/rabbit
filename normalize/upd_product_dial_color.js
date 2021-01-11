const { MongoClient } = require('mongodb');
const { getColor } = require('./utils/index');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'reference_product',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    let r = await db.collection(mdb.coll).distinct("dial.color", { lang: "en" });
    for (let i = 0; i < r.length; i++) {
      let color = "";
      if (r[i].match(/ dial/i)) {
        let s = r[i].split(' dial');
        let found = false;
        for (let j = 0; j < s.length && !found; j++) {
          let d = getColor(s[j]);
          if (d !== s[j]) {
            color = d;
            found = true;
          }
        }
      } else if (r[i].match(/,/)) {
        // comma separated color and other description
        let s = r[i].split(' dial');
        let found = false;
        for (let j = 0; j < s.length && !found; j++) {
          let d = getColor(s[j]);
          if (d !== s[j]) {
            color = d;
            found = true;
          }
        }
      } else {
        // normal 1 line sentence
        const d = getColor(r[i]);
        if (d !== r[i]) {
          color = d
        }
      }
      if (color) {
        console.log(color, '>>>>>', r[i]);
        await db.collection(mdb.coll).updateMany(
          { "dial.color": r[i] },
          { $set: { "dial.color": color } }
        )
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();