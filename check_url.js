const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
      port: 27017,
      user: 'synopsis',
      pass: 'synopsis',
      name: 'synopsis',
      coll: 'reference_urls',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const l = 1000;
    let num = await db.collection(mdb.coll)
      .find({ source: { $ne: "official" }, product: { $exists: false } })
      .count();
    let loopCnt = Math.ceil(num / l);
    for (let i = 0; i < loopCnt; i++) {
      let data = await db.collection(mdb.coll)
        .find({ source: { $ne: "official" }, product: { $exists: false } })
        .limit(l)
        .toArray();
      let d = (await axios.get(data[i].url)).data;
      let $ = cheerio.load(d);
      let watch = false;
      switch (data[i].source) {
        case "jomashop":
          const w = $('#attribute-id-category').text();
          if (w.match(/watch/i)) watch = true;
          break;
        case "prestigetime":
          // new product
          $('.table.table-condensed.item-table tr').each((idx, el) => {
            const word = $(el).find('td').text().trim();
            if (word.match(/case material/i)) {
              watch = true;
            }
          })
          // preowned
          $('#table-description tr').each((idx, el) => {
            const word = $(el).find('td').text().trim();
            if (word.match(/case material/i)) {
              watch = true;
            }
          })
          break;
        case "watchmaxx":
          break;
        case "watchesofmayfair":
          break;
        default:
          break;
      }
      if (watch) {
        // update reference_urls with product = true
      } else {
        // update reference_urls with product = false
      }
    }

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
