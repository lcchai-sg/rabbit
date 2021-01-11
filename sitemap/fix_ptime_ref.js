const { MongoClient } = require('mongodb');
const axios = require('axios');
const pt = require('./ptime_missed');
const { generateBrandID } = require('../normalize/utils');

(async () => {
  const mdb = {
    host: '192.168.200.227',
    port: 27017,
    user: 'productManager',
    pass: 'UInJRX7m',
    name: 'synopsis',
    coll: 'reference_urls',
  };
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = conn.db(mdb.name);
  const source = 'prestigetime';
  const lang = 'en';
  let payload = { source, lang, collections: ['all'], items: { 'all': [], } };

  for (let i = 0; i < pt.length; i++) {
    console.log(pt.length, i, pt[i]);
    try {
      let { id: brandID, name: brand } = generateBrandID(pt[i]);

      let collection = '';
      let v = pt[i].split('/');
      if (pt[i].match(/item/i)) {
        // https://www.prestigetime.com/item/<brand>/<collection>/<name?reference>.html
        collection = v[v.length - 2];
        // https://www.prestigetime.com/<brand><collection?name?reference>.html
      }
      payload.items['all'].push({
        source, lang, brand, brandID, url: pt[i],
        name: v[v.length - 1].replace('.html', '').replace(new RegExp('-', 'g'), ' '),
        reference: v[v.length - 1].replace('.html', '').replace(new RegExp('-', 'g'), '.'),
        collection, price: null,
      });
    } catch(e) {
      //update db with error code
      console.log(e);
    }
  }
  console.log('number of items:', payload.items['all'].length);
  for (let i = 0; i < payload.items['all'].length-1; i++) {
    console.log(payload.items['all'][i]);
  }
  process.exit(0);
})();
