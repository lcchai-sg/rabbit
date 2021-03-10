const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

(async () => {
  const mdb = {
    host: '192.168.10.143',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'd_product',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const rr = await db.collection(mdb.coll).find({ $or: [{ name: /mother[ -]?(of)?[ -]?pearl|m[-]?o[-]?p/i }, { "dial.color": /mother[ -]?(of)?[ -]?pearl|m[-]?o[-]?p/i }] }).toArray();
  const r = rr.filter(r => !r.dialColor || !r.dialColor.match(/mother of pearl/i));
  for (let i = 0; i < r.length; i++) {
    const dc = r[i].dial && r[i].dial.color ? r[i].dial.color : null;
    const ext = r[i].external ? r[i].external : null;
    console.log(`${i}   ${r[i].name}   dc : ${r[i].dialColor}   d.c : ${dc}`)
    r[i].dialColor = 'mother of pearl';
    if (r[i].dial && r[i].dial.color) {
      if (!r[i].dial.color.match(/mother of pearl/i)) {
        if (r[i].dial.color) r[i].dial.color = r[i].dial.color + ' Mother of Pearl';
        else {
          const c = Mappers.getColor.map(r[i].name);
          if (c) r[i].dial.color = c;
        }
      }
    } else {
      const c = Mappers.getColor.map(r[i].name);
      if (!r[i].dial) r[i].dial = {};
      r[i].dial.color = c;
    }
    console.log('   ', r[i].id, r[i].name, ' dc : ', r[i].dialColor, ' d.c : ', r[i].dial.color);
    console.log('   ', r[i].reference, r[i].SKU, r[i].external);
    console.log();
    console.log(`db.product.findOneAndUpdate({id:'${r[i].id}'},{$set:{dialColor:'${r[i].dialColor}','dial.color':'${r[i].dial.color}'}})`);
    console.log();
  }

  process.exit(0)
})()
