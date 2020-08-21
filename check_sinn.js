const { MongoClient } = require('mongodb');

(async () => {
  const mdb = {
    user: 'synopsis',
    pass: 'synopsis',
    port: 27017,
    name: 'synopsis',
    host: '127.0.0.1',
  };

  const ref_prod = 'reference_product';
  const ref_urls = 'reference_urls';
  const ref_raw = 'reference_raw';

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  console.log('start check >>>>>');
  let raw = await db.collection(ref_raw).find({ brandID: 180 }).toArray();
  for (const r of raw) {
    let p = await db.collection(ref_prod).find({ reference: r.reference });
    console.log(p)
    if (!p) console.log(r.reference, r.url); else console.log(r.reference, " | ", p.reference);
  }
  console.log('check complete >>> reference_product', raw.length);
  process.exit(0)
})();
