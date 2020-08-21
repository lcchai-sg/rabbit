const axios = require('axios');
const xml2js = require('xml2js');
const { MongoClient } = require('mongodb');

(async () => {
  const entry = "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml";
  const parser = new xml2js.Parser();
  const data = (await axios.get(entry)).data;
  const results = [];
  parser.parseString(data, (err, result) => {
    for (let i = 1; i < result.urlset.url.length; i++) {
      if (result.urlset.url[i].priority[0] === '1.0') {
        const url = result.urlset.url[i]['loc'][0];
        const name = result.urlset.url[i]['image:image'][0]['image:title'][0];
        const thumbnail = result.urlset.url[i]['image:image'][0]['image:loc'][0];

        let d = url.split('/');
        d = d[d.length - 1].replace('.html', '');
        d = d.split('-');
        let reference = '';
        if (d[0].match(/h[0-9]{8}/)) {
          reference = d[0].toUpperCase();
        } else {
          let r = d[d.length - 1].replace('.html', '');
          if (r.match(/h[0-9]{8}/)) {
            reference = r.toUpperCase();
          } else {
            reference = 'noRef';
          }
        }

        results.push({
          name, reference, url, thumbnail
        })
      }
    }
  });

  const mdb = {
    user: 'root',
    pass: 'sysadmin',
    host: '127.0.0.1',
    port: 27017,
    name: 'synopsis',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  for (const r of results) {
    r.brandID = 62;
    r.lang = "en";
    r.brand = "Hamilton";
    r.date = "2020-07-30";
    r.recordedAt = new Date();
    r.lastCheckAt = new Date();
    await db.collection('reference_urls').insertOne(r);
  }

  console.log('done')
  process.exit(0)
})();