const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const { client, entry, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Alpina";
  const brandID = 288;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  try {
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
        const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
        const ref = thumbnail.split('/');
        const refr = ref[ref.length - 1].split('?')[0];
        const reference = (refr.match(/al-\d{3}[A-z]/i)) ? refr.substr(0, 12) : null;
        const collection = name.match(/comtesse/i) ? 'COMTESSE' : name.split(' ')[0].toUpperCase();
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, collection, url, name,
          reference, thumbnail, price: null,
        })
      }
    });
    return result;
  } catch (error) {
    console.log('Failed indexing for Alpina with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    $('script[type="application/ld+json"]').each((idx, el) => {
      const c = $(el).contents().toString();
      const j = JSON.parse(c);
      if ((j['@type']) === 'Product') {
        j.offers.forEach(p => {
          if (p.name === 'intl') {
            result.price = p.priceCurrency + p.price;
          }
        })
        result.reference = j.sku;
        result.name = j.name.replace(/(<([^>]+)>)/ig, '');
      }
    })
    if (result.name) {
      if (result.name.match(/comtesse/i)) result.collection = 'COMTESSE';
      else result.collection = result.name.split(' ')[0];
    }
    const c = $("#bold-platform-data").contents().toString();
    const j = JSON.parse(c);
    const values = j.product.description.split('\n');
    result.description = j.product.description.replace(/(<([^>]+)>)/ig, '');

    let cat = '';
    values.forEach(val => {
      const v = val.replace(/ data-mce-fragment=\"1\"/gi, "").replace(/ bis_skin_checked=\"1\"/gi, "");
      if (v.match(/HIGHLIGHTS/i)) cat = 'HIGHLIGHTS';
      else if (v.match(/h2/i)) cat = v.replace(/(<([^>]+)>)/ig, '');
      if (cat === '') cat = 'HIGHLIGHTS';
      if (v.match(/<p|<div/i)) {
        const vv = v.split('<br>');
        vv.forEach(val => {
          const newVal = val.replace(/(<([^>]+)>)/ig, '').split(':');
          const value = newVal[newVal.length - 1].trim();
          if (value) result.spec.push({ cat, key: newVal.length === 2 ? newVal[0] : '', value });
        })
      }
    })
  } catch (error) {
    console.error('Failed extraction for Alpina with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://alpinawatches.com/sitemap_products_1.xml?from=4802581004426&to=5853158637730",
  })
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log(c);
  //   r.items[c].forEach(v => {
  //     console.log(v);
  //   })
  //   console.log();
  // })

  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       ...r.items[c][j],
  //       client: axios,
  //       entry: r.items[c][j]['url'],
  //     });
  //     // console.log(ex.url)
  //     // console.log()
  //     // console.log('d1 > ', ex.description);
  //     // console.log()
  //     // console.log('d2 > ', ex.description1);
  //     // console.log()
  //     ex.spec.forEach(v => {
  //       console.log(v.cat + ' >>> ' + v.key + ' >>> ' + v.value);
  //     });
  //     // console.log()
  //     // console.log('--------------------------------------');
  //     // console.log()
  //   }
  // }

  const rr = [
    "https://alpinawatches.com/products/alpiner-quartz-ref-al-240ns4e6",
    "https://alpinawatches.com/products/alpiner-quartz-ref-al-240ss4e6b",
    "https://alpinawatches.com/products/alpiner-quartz-ref-al-240gs4e6b",
    "https://alpinawatches.com/products/alpiner-quartz-ref-al-240ns4e6b",
    "https://alpinawatches.com/products/alpiner-4-automatic-ref-al-525bs5aq6b",
  ];

  for (let k = 0; k < rr.length; k++) {
    const ex = await extraction({
      client: axios,
      entry: rr[k],
    });
    console.log(ex);
    // console.log(ex.url)
    // console.log()
    // console.log('d1 > ', ex.description);
    // console.log()
    // console.log('d2 > ', ex.description1);
    // console.log()
    // ex.spec.forEach(v => {
    //   console.log(v.cat + ' >>> ' + v.key + ' >>> ' + v.value);
    // });
    // console.log()
    console.log('--------------------------------------');
    console.log()
  }
})();