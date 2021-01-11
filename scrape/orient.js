const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.orient-navbar-main  li:nth-child(2) .collection-grid  .grid__item .collection-grid-item').each((idx, el) => {
      const href = $(el).find('a').attr('href');
      const name = $(el).find('.collection-grid-item__title h3').text().trim();
      const url = base + href;
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.grid__item  .has-other-price.orient-product-item.grid-view-item').each((idx, el) => {
        const href = $$(el).find('.grid-view-item__link').attr('href');
        const thumbnailImg = $$(el).find('.grid-view-item__image-container img').attr('src');
        const name = $$(el).find('.orient-product-item-text .orient-product-item-title').text().trim();
        const retail = $$(el).find('.product-price__other-price').text();

        result.items[cat.name].push({
          url: base + href,
          thumbnail: "https:" + thumbnailImg,
          name,
          retail,
        })
      })
    }
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Orient with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('title').text().trim();
    result.reference = reference.split("|")[1].trim().substring(0, 10);
    result.collection = $(' .list-inline li:nth-child(3)  span a').text().trim();
    result.description = $('.product-single__description__inner--additional p').text().trim();
    $('.product-single__title').each((idx, el) => {
      if (idx === 0) {
        result.name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
    result.gender = 'M';
    result.thumbnail = 'https:' + $('.product-single__photo img').attr('src');

    $('.product-single__description__table').each((idx, el) => {
      const key = $(el).find('div:nth-child(1)').first().text().trim();
      const value = $(el).find('div:nth-child(2)').first().text().trim();
      result.spec.push({ key, value });

      $('div[style="width: 100%; line-height: 250%;"]').each((idx, el) => {
        const d = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(":");
        if (d) {
          result.spec.push({ key: d[0].trim(), value: d[1].trim() });
        }
      })
      // let key = '';
      // let value = '';
      // const keys = [];
      // const values = [];
      // $(el).find('div:nth-child(1)').each((idx, el) => {
      //   key = $(el).text().trim();
      //   keys.push(key);
      // });
      // $(el).find('div:nth-child(2)').each((idx, el) => {
      //   value = $(el).text().trim();
      //   values.push(value);
      // });
      // keys.map((key, i) => {
      //   const value = values[i];
      //   result.spec.push({ key, value });
      // });
    });
  } catch (error) {
    console.log('Failed extraction for Orient with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.orientwatchusa.com",
  //   brandID: 100,
  //   brand: "Orient",
  //   base: "https://www.orientwatchusa.com",
  // });
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  // console.log(r);

  const rr = [
    "https://www.orientwatchusa.com/collections/classic/products/ra-ak0304b10a",
    "https://www.orientwatchusa.com/collections/sport/products/ra-ac0k05g00b",
    "https://www.orientwatchusa.com/collections/orient-star/products/re-av0a04b00b",
  ];

  for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      entry: rr[i],
      client: axios,
      brand: "Orient",
      brandID: 100,
    })
    console.log(ex);
  }
})();