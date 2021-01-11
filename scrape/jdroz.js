const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Jaquet Droz";
  const brandID = 174;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  const uniq = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.view .view-content .item-list .views-field.views-field-nothing .field-content a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').replace('\'', '').trim();
      const url = $(el).attr('href');
      cats.push({ name, url });
      result.collections.push(name);
      result.items[name] = [];
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.content .item-list li a').each((idx, el) => {
        const url = $$(el).attr('href');
        const thumbnail = $$(el).find(' img').attr('src');
        const reference = "J" + $$(el).find('img').attr('alt').match(/\d+\.?\d*/);
        const name = $$(el).find('.field_title').text();
        result.items[cat.name].push({
          source, lang, brand, brandID, url, collection: cat.name,
          name, reference, thumbnail, price: null,
        });
        if (uniq.indexOf(url) < 0) uniq.push(url);
      });
    }
    console.log('unique URL >', uniq.length);
    return result;
  } catch (error) {
    console.error('Failed indexing for Jaquet Droz with error : ' + error);
    console.error('entry : ', entry);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.description = $('.description').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.name = $('.watch-infos h1').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.collection = $('.back-collection a h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.gender = 'M';
    result.thumbnail = $('.watch-picture img').attr('src');
    $('.watch-spec .table tr').each((idx, el) => {
      const key = $(el).find('th').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('td').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
      if (key === 'Reference') result.reference = value;
    });
    $('.watch-infos .variantes div ul li a').each((idx, el) => {
      const ref = "J" + $(el).find('img').attr('alt').match(/\d+\.?\d*/);
      result.related.push(ref);
    });
  } catch (error) {
    console.error('Failed extraction for Jaquet Droz with error : ' + error);
    console.error('entry : ', entry);
    result.code = error.response.status;
  }
  return result;
};

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.jaquet-droz.com/en/watches",
    brandID: 174,
    brand: "Jaquet Droz",
    base: "https://www.jaquet-droz.com",
  });
  // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = r.items[r.collections[0]];
  // const rr = [
  //   "https://www.montblanc.com/en-us/wrist-watches_cod19971654707009597.html",
  //   "https://www.montblanc.com/en-us/wrist-watches_cod34480784411826082.html",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client: axios,
  //     brand: "Jaquet Droz",
  //     brandID: 174,
  //   })
  //   console.log(ex);
  // }
})();