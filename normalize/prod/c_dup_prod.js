const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      // host: "203.118.42.106",
      host: "127.0.0.1",
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "reference_product",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);

    const u = [
      "https://www.jomashop.com/mido-watch-m021-431-11-041-00.html",
      "https://www.jomashop.com/mido-watch-m026-430-22-051-00.html",
      "https://www.jomashop.com/mido-watch-m016-414-11-041-00.html",
      "https://www.jomashop.com/mathey-tissot-watch-h710ai.html",
      "https://www.jomashop.com/mido-comander-watch-m021-626-36-051-00.html",
      "https://www.jomashop.com/mido-watch-m005-614-36-051-22.html",
      "https://www.jomashop.com/mido-watch-m026-430-37-051-00.html",
      "https://www.jomashop.com/hamilton-khaki-mens-watch-h70515137.html",
      "https://www.jomashop.com/calvin-klein-watch-k4u23126.html",
      "https://www.jomashop.com/mido-baroncelli-iii-watch-m0274261101800.html",
      "https://www.jomashop.com/mido-watch-m032-607-36-050-00.html",
      "https://www.jomashop.com/philip-stein-watch-300sbecrstch.html",
      "https://www.jomashop.com/mido-watch-m005-430-36-031-80.html",
      "https://www.jomashop.com/mido-multifort-watch-m0384313603100.html",
      "https://www.jomashop.com/mido-watch-m027-408-16-018-00.html",
      "https://www.jomashop.com/orient-nami-watch-fac09004d0.html",
      "https://www.jomashop.com/mido-multifort-iii-watch-m0384311106100.html",
      "https://www.jomashop.com/mido-watch-m0059293603100.html",
      "https://www.jomashop.com/rado-watch-r12393633.html",
      "https://www.jomashop.com/breitling-watch-ab2010161c1a1.html",
    ];

    for (let i = 0; i < u.length; i++) {
      const p = await db.collection(mdb.coll).find({ url: u[i] }).toArray();
      if (p.length > 0) {
        const fp = { ...p };
        for (let j = 1; j < p.length; j++) {

        }
      }
    }

  } catch (e) {
    console.log(e);
  }
  console.log()
  console.log('***** DONE *****');
  process.exit(0);
})();