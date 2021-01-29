const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Frédérique Constant";
  const brandID = 154;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  try {
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
        const reference = url.match(/fc-\w+/i) ? url.match(/fc-\w+/ig)[0].toUpperCase() :
          thumbnail.match(/fc-\w+/i) ? thumbnail.match(/fc-\w+/ig)[0].toUpperCase() : null;
        const name = (res.urlset.url[i]['image:image'][0]['image:title']) ? res.urlset.url[i]['image:image'][0]['image:title'][0] : 'noname';
        const collection = name;
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
    console.log('Failed indexing for Frédérique Constant with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.thumbnail = $('.product-page--root').find('meta[property="og:image"]').first().attr('content');
    result.name = $('.product-page--root').find('.product-page--title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-page--root').find('h2').text();
    result.retail = $('.product-page--root').find('.price--container').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.product-page--description .rte-content').find('div').each((idx, el) => {
      const s = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const sp = s.split(':');
      if (sp.length === 2)
        result.spec.push({ key: sp[0].trim(), value: sp[1].trim() });
      else if (sp.length === 1)
        result.spec.push({ key: 'techdata', value: sp[0].trim() });
    });
    if (result.spec.length === 0) {
      // different structure
      if (result.name.match(/analytic/i)) result.code = 'not product';
      else {
        let withColon = true; let key = ''; let html = false; let bad = false;
        $('.product-page--description .rte-content').find('p').each((idx, el) => {
          const s = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          if (idx === 0)
            if (s.match(/:/)) withColon = true; else withColon = false;
          if (withColon) {
            if (bad) {
              if (idx % 2 === 0) result.spec.push({ key, value: s });
              else key = s.replace(':', '');
            } else {
              if (idx % 2 === 0) key = s.replace(':', '');
              else {
                result.spec.push({ key, value: s });
                if (s.match(/Dial:/)) {
                  key = "Dial";
                  bad = true;
                }
              }
            }
          } else {
            const data = $(el).contents().toString();
            if (data.match(/<br>/i)) html = true;
            if (html) {
              const sp = data.split('</strong>');
              const k = sp ? sp[0].split('>') : null;
              const key = !k ? 'techdata' :
                k[k.length - 1] ? k[k.length - 1] : k[k.length - 2].replace('<br', '');
              const value = s.replace(new RegExp(key, ''), '').trim();
              result.spec.push({ key, value });
            } else {
              if (idx % 2 === 0) key = s;
              else result.spec.push({ key, value: s });
            }
          }
        })
      }
    }
  } catch (error) {
    console.error('Failed extraction for Frederique Constant with error : ' + error);
    console.error('entry : ', entry)
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};



(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });
  //https://frederiqueconstant.com/sitemap.xml
  // const r = await indexing({
  //   client,
  //   entry: "https://frederiqueconstant.com/sitemap_products_1.xml?from=4620948930607&to=4757665021999",
  //   //"https://frederiqueconstant.com/sitemap_products_1.xml?from=4620948930607&to=4757665021999",
  //   brandID: 154,
  //   brand: "Frédérique Constant",
  //   base: "https://frederiqueconstant.com",
  // });


  const r = [
    "https://frederiqueconstant.com/products/ladies-moonphase-fc-206mpwd1s4",
    "https://frederiqueconstant.com/products/highlife-automatic-cosc-fc-303s4nh6b",
    "https://frederiqueconstant.com/products/classics-quartz-chronograph-serie-speciale-france-fc-292mb5tb6",
    "https://frederiqueconstant.com/products/classics-index-automatic",
  ];
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client,
      entry: r[i],
    })
    console.log(ex)
  }
  // console.log(r)
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       ...r.items[c][j],
  //       client: axios,
  //       entry: r.items[c][j]['url'],
  //     });
  //     // console.log(ex);
  //     console.log(ex.url)
  //     ex.spec.forEach(s => {
  //       console.log(s.key + ' | ' + s.value);
  //     });
  //     console.log()
  //   }
  // }
})();