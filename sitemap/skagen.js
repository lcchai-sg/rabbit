const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers } = require('./utils');

const extraction = async (context) => {
  try {
    const { client, entry, source, lang, brand, brandID, name, collection, gender, reference, } = context;
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      name,
      reference,
      collection,
      gender,
      scripts: [],
      spec: [],
      related: [],
    }
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    const { id: brandid, name: brandname } = Mappers.generateBrandID.map(entry);
    result.gender = Mappers.getGender.map(entry);
    result.brand = brandname;
    result.brandID = brandid;
    $('meta').each((idx, el) => {
      switch ($(el).attr('property')) {
        case 'og:title': result.name = $(el).attr('content'); break;
        case 'og:image': result.thumbnail = $(el).attr('content'); break;
        case 'product:price:currency': result.currency = $(el).attr('content'); break;
        case 'product:price:amount': result.price = $(el).attr('content'); break;
      }
    });
    result.breadcrumbs = $('.breadcrumbs').text().replace(/(?:\r\n|\r|\n|\s+)/g, ">").trim();
    result.description = $('.product.attribute.description').text().trim();
    let key = "";
    let value = "";
    $('#product-attribute-specs-table').find('tr').each((idx, el) => {
      key = $(el).find('th').text().trim();
      value = $(el).find('td').text().trim();
      result.spec.push({ key, value, });
    })
    return result;
  } catch (error) {
    const { entry, lang, source, } = context;
    console.error('Failed extraction for Skagen with error : ' + error);
    console.error('url:', entry);
    return { source, url: entry, lang, code: error.response.status, }
  }
};

(async () => {
  const entry = "https://www.skagen.com/en-us/sitemap/";
  const { data } = await axios.get(entry);
  const $ = cheerio.load(data);
  let uniq = []
  let result = {};
  $('.product').each((idx, el) => {
    const url = $(el).find('a').attr('href');
    if (url.match(/-watch-/i) && (!(url.match(/band|watch-strap/i)))) {
      let v = url.split('-');
      let ref = v[v.length - 1];
      if (uniq.indexOf(ref) < 0) {
        uniq.push(ref);
        result[ref] = [];
      }
      result[ref].push(url);
    }
  })

  // console.log(result);
  // console.log('number >', result.length);
  console.log('uniq>', uniq.length)

  const result1 = { source: "official", lang: "en", collections: ['all'], items: { 'all': [] } };
  uniq.forEach(u => {
    let r = result[u][0];
    let v = r.split('/');
    let n = v[v.length - 1].split('-');
    let name = n.slice(0, n.length - 1).join(' ').toUpperCase();
    result1.items['all'].push({
      source: "official", lang: "en", brand: "Skagen", brandID: 240,
      url: r, name, reference: u.toUpperCase(), price: null,
    })
  })

  console.log(result1.items['all'].length)
  result1.items['all'].forEach(d => console.log(d));

  // uniq.forEach(v => console.log(v))

  // const u = [
  //   'https://www.skagen.com/en-us/women/gitte-steel-mesh-watch-skw2561',
  //   'https://www.skagen.com/en-us/women/ancher-leather-watch-skw2609',
  //   'https://www.skagen.com/en-us/women/ancher-steel-link-watch-skw2606',
  //   'https://www.skagen.com/en-us/women/anita-silicone-watch-skw2605',
  //   'https://www.skagen.com/en-us/women/hagen-leather-double-wrap-watch-skw2598',
  //   'https://www.skagen.com/en-us/women/hald-dark-gray-steel-mesh-watch-skw2492',
  //   'https://www.skagen.com/en-us/women/hagen-rectangular-steel-mesh-watch-skw2567',
  //   'https://www.skagen.com/en-us/women/gitte-leather-watch-skw2557',
  //   'https://www.skagen.com/en-us/women/anita-steel-mesh-watch-skw2473',
  //   'https://www.skagen.com/en-us/women/ancher-leather-watch-skw2480',
  // ];
  // for (let j = 0; j < u.length; j++) {
  //   let r = await extraction({
  //     client: axios,
  //     entry: u[j],
  //     source: "official",
  //     lang: "en",
  //     brand: "Skagen",
  //     brandID: 240,
  //     name: null,
  //     collection: null,
  //     gender: null,
  //     reference: null,
  //   });

  //   console.log(r);
  // }
})();