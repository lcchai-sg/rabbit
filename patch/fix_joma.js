const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      // production
      //host: '192.168.200.227',
      //port: 27017,
      //user: 'productManager',
      //pass: 'UInJRX7m',
      //name: 'synopsis',
      //coll: 'reference_raw',
      // local
      host: '127.0.0.1',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      raw: 'p_reference_raw',
      prod: 'p_reference_product',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);

    const limit = 10000;
    for (let i = 15; i < 40; i++) {
      const prod = await db.collection(mdb.prod).find({ source: "jomashop" }).skip(i * limit).limit(limit).toArray();
      if (prod.length <= 0) {
        console.log('prod.length <= 0');
        process.exit(0);
      }
      // for (let j = 0; j < 12; j++) {
      for (let j = 0; j < prod.length; j++) {
        console.log(i, j)
        const ps = prod[j].additional;
        if (ps && ps.length > 0) {
          if (!(Object.keys(ps[0])[0].match(/[A-Z]/))) {
            const raw = await db.collection(mdb.raw).find({ url: prod[j].url }).limit(1).toArray();
            if (raw.length > 0) {
              const rs = raw[0].spec;
              // setup rs
              const ai = {};
              for (let m = 0; m < rs.length; m++) {
                const k = rs[m]['key'].replace(":", "").trim().toLowerCase();
                ai[k] = rs[m]['key'].replace(":", "").trim();
              }
              // check ps
              const spec = [];
              ps.forEach(sp => {
                const s = Object.keys(sp)[0];
                if (ai[s])
                  spec.push({
                    key: ai[s],
                    value: sp[s],
                  })
              })
              if (spec.length > 0) {
                //output
                await db.collection(mdb.prod).findOneAndUpdate({ _id: prod[j]._id }, { $set: { additional: spec } });
                // console.log('updating : ', prod[j]._id, ' new : ', spec)
              }
            }
          }
        }
      }
    }
    console.log('***** done *****')
    process.exit(0)
  } catch (e) {
    console.error('error : ', e)
    process.exit(1)
  }
})();
