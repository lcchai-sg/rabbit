const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const sites = require('./cartier_sm');

(async () => {
  const extraction = async (entry) => {
    try {
      const base = "https://www.cartier.com";
      const result = {
        source: 'official',
        url: entry,
        brand: "Cartier",
        brandID: 28,
        lang: "en",
        gender: "F",
        spec: [],
      };
      const { data } = await axios.get(entry);
      const $ = cheerio.load(data);
      result.gender = entry.match(/women/i) ? 'F' : 'M';
      result.description = $('div.tabbed-content__content-column > p.paragraph').first().text().trim();
      result.thumbnail = base + $('.c-image-adaptive').attr('data-original-url');
      result.name = $('.top-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.reference = $('.small-text.js-pdp__cta-section--product-ref-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(":")[1].trim();
      result.spec = result.description.split('. ');

      return result;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const mdb = {
    user: 'synopsis',
    pass: 'synopsis',
    port: 27017,
    name: 'synopsis',
    host: '127.0.0.1',
    coll: 'cartier_prod',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  for (let i = 0; i < sites.length; i++) {
    console.log(sites.length, i, sites[i]);
    let r = await extraction(sites[i]);
    await db.collection(mdb.coll).insertOne(r);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('*** completed ***');
  process.exit(0);
})();