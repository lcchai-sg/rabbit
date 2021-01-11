const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Breuget";
  const brandID = 132;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.views-row ').each((idx, el) => {
      const name = $(el).find('h2 a').text();
      const url = base + $(el).find('h2 a').attr('href');
      const amount = $(el).find('.watches-number').text().replace('models', '').trim();
      const page = Math.floor(parseInt(amount) / 12);
      if (name && url) {
        cats.push({ name, url, page });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      if (cat.page > 0) {
        let current = 0;
        do {
          const link = cat.url + ((current > 0) ? '?page=' + current : '');
          current++;
          const $$ = cheerio.load((await client.get(link)).data);
          $$('.item-list .views-row a').each((idx, el) => {
            const url = base + $$(el).attr('href');
            const thumbnail = base + $$(el).find('img').attr('src');
            const name = $$(el).find('h2').text();
            result.items[cat.name].push({
              source, lang, brand, brandID, url, collection: cat.name,
              name, thumbnail, price: null,
            });
          });
        }
        while (current < (cat.page + 1))
      } else {
        const $$ = cheerio.load((await client.get(cat.url)).data);
        $$('.item-list .views-row a').each((idx, el) => {
          const url = base + $$(el).attr('href');
          const thumbnail = base + $$(el).find('img').attr('src');
          const name = $$(el).find('h2').text();
          result.items[cat.name].push({
            source, lang, brand, brandID, url, collection: cat.name,
            name, thumbnail, price: null,
          });
        });
      }
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Bvlgari with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  console.log('entry >>> ', entry)
  const { data } = await client.get(entry);
  const $ = cheerio.load(data);
  result.description = $('.field.field-name-field-description p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
  result.name = entry.split('/timepieces/')[1].split('/')[0] + ' ' + entry.split('/timepieces/')[1].split('/')[1];
  result.reference = $('.infos-watch h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
  result.collection = entry.split('/timepieces/')[1].split('/')[0].trim();
  result.thumbnail = $('.pane-variante img').attr('src');

  const id = $('.show-price-button').attr('data-ref').trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
  const ajaxData = 'https://www.breguet.com/en/ajax/price/' + id;
  result.retail = (await axios.get(ajaxData)).data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

  $('.list-produits-associes a').each((idx, el) => {
    const related = base + $(el).attr('href');
    result.related.push(related);
  });
  $('.list-spec li').each((idx, el) => {
    const key = $(el).find('label').text().trim();
    const value = $(el).find('.value').text().trim();
    result.spec.push({ key, value });
  });
  return result;
}


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  const r = await indexing({
    client,
    entry: "https://www.breguet.com/en/timepieces",
    brandID: 132,
    brand: "Breguet",
    base: "https://www.breguet.com",
  });
  console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  // r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  // {
  //   source: 'official',
  //   lang: 'en',
  //   brand: 'Bvlgari',
  //   brandID: 32,
  //   url: 'https://www.bulgari.com/en-int/103144.html',
  //   collection: 'Serpenti',
  //   name: 'Serpenti',
  //   reference: '103144',
  //   thumbnail: 'https://media2.bulgari.com/f_auto,q_auto,w_240,c_scale/production/dw483e12d6/images/images/484596.png',
  //   price: null,
  //   gender: 'F'
  // },
  // {
  //   source: 'official',
  //   lang: 'en',
  //   brand: 'Bvlgari',
  //   brandID: 32,
  //   url: 'https://www.bulgari.com/en-int/103148.html',
  //   collection: 'Serpenti',
  //   name: 'Serpenti',
  //   reference: '103148',
  //   thumbnail: 'https://media2.bulgari.com/f_auto,q_auto,w_240,c_scale/production/dw915b952f/images/images/493234.png',
  //   price: null,
  //   gender: 'F'
  // }
  // ];

  for (let i = 0; i < (rr.length - 1 > 5 ? 5 : rr.length - 1); i++) {
    console.log(i)
    const ex = await extraction({
      entry: rr[i].url,
      client,
      brand: "Breguet",
      brandID: 132,
      base: "https://www.breguet.com",
    })
    console.log(ex);
  }
})();