const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    const title = $('meta[property="og:title"]').attr('content').split('|');
    result.name = title[1].trim() + ' ' + title[0].trim();
    result.reference = title[0].trim();
    result.collection = title[1].trim();
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.price = $(".blk-ProductList_PriceTaxIn").first().text();
    $(".pr-Spec_Group").each((idx, el) => {
      const cat = $(el).find(".pr-Spec_HeadingLv1").text();
      $(el).find(".pr-Spec_Item").each((idx, el) => {
        const key = $(el).find(".pr-Spec_HeadingLv2").text();
        const value = $(el).find(".pr-Spec_Text").text();
        result.spec.push({ cat, key, value })
      })
    })
  } catch (error) {
    console.log('Failed extraction for Vacheron Constantin with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};

const index = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Seiko";
  const brandID = 72;
  const result = { source, lang, brand, brandID, collections: [], items: {}, };
  const refprod = { refs: [], items: {} };
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(url => {
      const ul = url.split('/');
      if (ul.length === 7 && url.match(/-en\/products/i)) {
        const collection = ul[5].replace(/-/g, ' ').toUpperCase();
        const reference = ul[6].toUpperCase();
        const name = collection + ' ' + reference
        if (reference && reference.match(/\d/) && !reference.match(/-|_/)) {
          if (refprod.refs.indexOf(reference) < 0) {
            refprod.refs.push(reference);
            refprod.items[reference] = [];
          }
          refprod.items[reference].push({ url, collection, reference, name, })
        }
      }
    })
    refprod.refs.forEach(r => {
      const p = refprod.items[r].sort()[0];
      if (result.collections.indexOf(p.collection) < 0) {
        result.collections.push(p.collection);
        result.items[p.collection] = [];
      }
      result.items[p.collection].push({ source, lang, brand, brandID, ...p, price: null, })
    })
    return result;
  } catch (error) {
    console.error('Failed indexing for Seiko with error : ', error);
    console.error('entry : ', entry);
    return {}
  }
}

(async () => {
  const r = await index({
    entry: "https://www.seikowatches.com/sitemap.xml",
  })
  // console.log(r)
  // r && r.collections.forEach(c => {
  //   console.log('collection.....', c)
  //   r.items[c].forEach(w => console.log(w));
  // })
  // const r = await indexing({
  //   client: axios,
  //   // entry: "https://www.seiko-watch.co.jp/collections/en",
  //   entry: "https://www.seikowatches.com/jp-ja/special/products/en/",
  //   brandID: 72,
  //   brand: "Seiko",
  //   base: "https://www.seiko-watch.co.jp/",
  // });
  // console.log(r);

  // const rr = [
  //   'https://www.seikowatches.com/ph-en/products/presage/SRPF41J1',
  //   'https://www.seikowatches.com/nz-en/products/prospex/SRPE87K1',
  //   'https://www.seikowatches.com/uk-en/products/king-seiko/SJE083J1',
  //   'https://www.seikowatches.com/ph-en/products/astron/SSH077J1',
  //   'https://www.seikowatches.com/au-en/products/5sports/SRPE71K1',
  //   'https://www.seikowatches.com/nz-en/products/coutura/SSC800P1',
  //   'https://www.seikowatches.com/au-en/products/discovermore/SSC777P1',
  //   'https://www.seikowatches.com/us-en/products/lukia/SPB133',
  //   'https://www.seikowatches.com/us-en/products/diamondcollection/SUT371',
  //   'https://www.seikowatches.com/global-en/products/seikopremier/SNP165P1',
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Seiko",
  //     brandID: 72,
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        client: axios,
        entry: r.items[c][j].url,
        ...r.items[c][j],
      });
      console.log(ex);
      ex.spec.forEach(s => console.log(s.cat + ' | ' + s.key + ' | ' + s.value))
    }
  }
})();