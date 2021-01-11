const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const getCollection = (url, collections) => {
  let col = 'unknown';
  Object.keys(collections).forEach(collection => {
    const m = new RegExp(collection, 'i');
    if (url.match(m)) col = collections[collection];
  });
  return col;
}

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = 'official';
  const lang = 'en';
  const brand = 'A. Lange & Söhne';
  const brandID = 293;
  const result = { source, lang, brand, brandID, collections: [], items: {}, };
  const collections = {};
  try {
    const c_entry = "https://www.alange-soehne.com/en/timepieces";
    const { data } = await client.get(c_entry);
    const $ = cheerio.load(data);
    $(".list__item.families__item").each((idx, el) => {
      const url = $(el).attr("href");
      const u = url.split('/');
      const uname = u[u.length - 1].replace('family-', '');
      const name = $(el).find(".families__item__title").text().trim();
      collections[uname] = name;
    })

    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    })
    const d = await sitemap.fetch();
    d.sites.forEach(u => {
      const url = u.replace("http://default", "https://www.alange-soehne.com");
      if (url.match(/\/en\/timepieces\//i)) {
        const ul = url.split("/");
        if (ul.length >= 6) {
          const collection = getCollection(url, collections);
          const name = ul[ul.length - 1].split('-').join(' ').toUpperCase();
          if (result.collections.indexOf(collection) < 0) {
            result.collections.push(collection);
            result.items[collection] = [];
          }
          result.items[collection].push({
            source, lang, brand, brandID, url, collection, name, price: null,
          })
          console.log('url : ', url)
        }
      }
    })
    return result;
  } catch (error) {
    console.error('Error indexing for A. Lange & Söhne with error ', error);
    console.error('entry : ', entry);
    return {};
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.description = $('meta[property="og:description"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.collection = $(".article__overtitle").text().replace(/\s+/g, ' ').trim();
    result.name = $(".article__title").text().replace(/\s+/g, ' ').trim();
    result.reference = $(".article__reference").text().replace("Reference: ", "").trim();
    result.price = $(".article__price").find("span").text();
    $(".product-specs__table__row").each((idx, el) => {
      const key = $(el).find("dt").text().replace(/\s+/g, ' ').trim();
      const value = $(el).find("dd").text().replace(/\s+/g, ' ').trim();
      result.spec.push({ key, value });
    })
    if (result.spec.length === 0 && !result.description && !result.thumbnail)
      result.code = 'not product';
  } catch (error) {
    console.error('Failed extraction for A. Lange & Söhne with error ', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.alange-soehne.com/en/sitemap.xml",
    base: "https://www.alange-soehne.com/en",
  })
  console.log(r);
  // r.collections.forEach(c => {
  //   console.log('collection.....', c);
  //   r.items[c].forEach(w => console.log(w));
  // })

  // const rr = [
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'A. Lange & Söhne',
  //     brandID: 293,
  //     url: 'http://www.alange-soehne.com/en/timepieces/richard-lange-tourbillon-pour-le-merite',
  //     collection: 'RICHARD LANGE',
  //     name: 'RICHARD LANGE TOURBILLON POUR LE MERITE',
  //     price: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'A. Lange & Söhne',
  //     brandID: 293,
  //     url: 'http://www.alange-soehne.com/en/timepieces/richard-lange-tourbillon-pour-le-merite-handwerkskunst',
  //     collection: 'RICHARD LANGE',
  //     name: 'RICHARD LANGE TOURBILLON POUR LE MERITE HANDWERKSKUNST',
  //     price: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'A. Lange & Söhne',
  //     brandID: 293,
  //     url: 'http://www.alange-soehne.com/en/timepieces/odysseus/odysseus-363038',
  //     collection: 'ODYSSEUS',
  //     name: 'ODYSSEUS 363038',
  //     price: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'A. Lange & Söhne',
  //     brandID: 293,
  //     url: 'http://www.alange-soehne.com/en/timepieces/odysseus/odysseus-363068',
  //     collection: 'ODYSSEUS',
  //     name: 'ODYSSEUS 363068',
  //     price: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'A. Lange & Söhne',
  //     brandID: 293,
  //     url: 'http://www.alange-soehne.com/en/timepieces/odysseus',
  //     collection: 'ODYSSEUS',
  //     name: 'ODYSSEUS',
  //     price: null
  //   }
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     client: axios,
  //     entry: rr[i].url,
  //     base: "https://www.alange-soehne.com/en",
  //     ...rr[i],
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; r.items[c].length; j++) {
      console.log(r.items[c][j])
      const ex = await extraction({
        client: axios,
        entry: r.items[c][j].url,
        base: "https://www.alange-soehne.com/en",
        ...r.items[c][j],
      })
      console.log(ex.url);
      ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
      console.log();
    }
  }
})();