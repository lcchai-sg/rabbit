const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const sitemapper = require('sitemapper');

const indexing = async context => {
  const source = "official";
  const lang = "en";
  const brand = "Frédérique Constant";
  const brandID = 154;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const coll = [];
  try {
    {
      const col_url = "https://frederiqueconstant.com/pages/master-catalogue";
      const { data } = await client.get(col_url);
      const $ = cheerio.load(data);
      $('h3[data-pf-type="Heading"]').each((idx, el) => {
        // const url = $(el).find("a").attr("href");
        const name = $(el).text();
        // console.log('r:', name, url)
        coll.push(name);
      })
    }
    const { data } = await client.get(entry);
    const link = data.match(/<loc>.*<\/loc>/ig);
    const slink = link ? link[0].replace('<loc>', '').replace('</loc>', '').trim() : null;
    const data1 = slink ? (await client.get(slink)).data : null;
    const parser = new xml2js.Parser();
    parser.parseString(data1, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        if (url.match(/product/i)) {
          if (res.urlset.url[i]['image:image']) {
            const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
            const reference = url.match(/fc-\w+/i) ? url.match(/fc-\w+/ig)[0].toUpperCase() :
              thumbnail.match(/fc-\w+/i) ? thumbnail.match(/fc-\w+/ig)[0].toUpperCase() : null;
            const name = (res.urlset.url[i]['image:image'][0]['image:title']) ? res.urlset.url[i]['image:image'][0]['image:title'][0] : 'noname';
            const cname = coll.filter(c => name.match(new RegExp(c, 'i')));
            const coname = cname ? cname.length > 1 ? cname[1] : cname[0] : coll.filter(c => url.match(new RegExp(c, 'i')));
            const collection = coname ? cname.length > 1 ? cname[1] : cname[0] : 'other';
            if (result.collections.indexOf(collection) < 0) {
              result.collections.push(collection);
              result.items[collection] = [];
            }
            result.items[collection].push({
              source, lang, brand, brandID, collection, url, name,
              reference, thumbnail, price: null,
            })
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.log('Failed indexing for Frédérique Constant with error : ' + error);
    return {};
  }
}

const indexing1 = async context => {
  const source = "official";
  const lang = "en";
  const brand = "Frédérique Constant";
  const brandID = 154;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.sort().forEach(u => console.log(u))
    return result;
  } catch (error) {
    console.log('Failed indexing for Frédérique Constant with error : ' + error);
    return {};
  }
}

(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });
  //https://frederiqueconstant.com/sitemap.xml
  const r = await indexing({
    client,
    entry: "https://frederiqueconstant.com/sitemap.xml",
    brandID: 154,
    brand: "Frédérique Constant",
    base: "https://frederiqueconstant.com",
  });
  // console.log(r);
  r && r.collections && r.collections.forEach(c => {
    console.log('collection.....', c)
    r.items[c].forEach(w => console.log(w));
  })
})();