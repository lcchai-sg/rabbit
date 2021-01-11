const axios = require('axios');
const cheerio = require('cheerio');
const Sitemapper = require('sitemapper');
const { MongoClient } = require('mongodb');

const indexing = async () => {
  const entry = "https://tutima.com/sitemaps.xml";

  const sitemap = new Sitemapper({
    url: entry,
    timeout: 600000,
  });

  const result = [];
  const d = await sitemap.fetch();
  d.sites.sort();
  for (let i = 0; i < d.sites.length; i++) {
    if (d.sites[i].match(/tutima.com\/watch\//i)) {
      const u = d.sites[i].split('/');
      const n = u[u.length - 2].split('-');
      const ref = n[n.length - 2] + '-' + n[n.length - 1];
      const name = n.slice(0, n.length - 2).join(' ');
      result.push({
        source: "official",
        brand: "Tutima",
        brandID: 245,
        name,
        ref,
        url: d.sites[i],
      });
    }
  }
  return result;
}

const extraction = async (context) => {
  try {
    const { source, brand, brandID, name, ref, url } = context;
    let result = {
      source, brand, brandID, name, reference: ref, url, spec: [],
    };
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    $('meta').each((idx, el) => {
      switch ($(el).attr('property')) {
        // case 'og:url': result.url = $(el).attr('content'); break;
        //case 'og:title': result.name = $(el).attr('content'); break;
        case 'og:description': result.description = result.description ? result.description : $(el).attr('content'); break;
        case 'og:image': result.thumbnail = $(el).attr('content'); break;
        // case 'og:url': result.url = $(el).attr('content'); break;
        // case 'og:url': result.url = $(el).attr('content'); break;
        // case 'og:url': result.url = $(el).attr('content'); break;
        // case 'og:url': result.url = $(el).attr('content'); break;
      }
    })
    // $('.breadcrumb>a').each((idx, el) => {
    //   const bb = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    //   console.log('bb...', bb)
    // })

    result.collection = $('.subtitle').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    result.name = $('hgroup>h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    let key = "";
    let value = "";
    let hasInfo = true;
    $('.info-table tr td').each((idx, el) => {
      value = $(el).text().trim();
      if (idx === 0 && value === 'Movement') {
        hasInfo = false;
      }
      if (hasInfo) {
        if (idx % 2 === 0) {
          if (idx === 0) {
            result.spec.push({ key: 'info', value, })
          } else {
            result.spec.push({ key, value, });
          }
        } else {
          key = value;
        }
      } else {
        if (idx % 2 === 0) {
          key = value;
        } else {
          result.spec.push({ key, value, });
        }
      }
    })
    $('.product-details>p').each((idx, el) => {
      const d = $(el).text().split(':');
      const key = d[0].trim();
      const value = d[1].trim();
      // result.spec.push({ key, value });
      const dd = value.split('. ');
      for (let v = 0; v < dd.length; v++) {
        result.spec.push({ key, value: dd[v] })
      }

    })
    return result;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const mdb = {
    user: 'synopsis',
    pass: 'synopsis',
    port: 27017,
    name: 'synopsis',
    host: '127.0.0.1',
    prod: 'tutima_prod',
    urls: 'tutima_urls',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  // let r = await indexing();
  // for (let i = 0; i < r.length; i++) {
  //   console.log(r.length, i, r[i].url);
  //   await db.collection(mdb.urls).insertOne(r[i]);
  // }

  let u = await db.collection(mdb.urls).find().toArray();
  for (let i = 0; i < u.length; i++) {
    console.log('extraction ', u.length, i, u[i].url);
    let e = await extraction(u[i]);
    db.collection(mdb.prod).insertOne(e);
    // console.log('     ', e)
  }

  console.log('*** completed ***');
  process.exit(0);
})();