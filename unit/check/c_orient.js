const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
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
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Orient' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      spec: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('title').text().trim();
    const collection = $(' .list-inline li:nth-child(3)  span a').text().trim();
    const description = $('.product-single__description__inner--additional p').text().trim();
    $('.product-single__title').each((idx, el) => {
      if (idx === 0) {
        result.name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });

    result.reference = reference.split("|")[1].trim().substring(0, 10);
    result.collection = collection;
    result.description = description;
    result.gender = 'M';
    result.thumbnail = 'https:' + $('.product-single__photo img').attr('src');

    $('.product-single__description__table').each((idx, el) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      $(el).find('div:nth-child(1)').each((idx, el) => {
        key = $(el).text().trim();
        keys.push(key);
      });
      $(el).find('div:nth-child(2)').each((idx, el) => {
        value = $(el).text().trim();
        values.push(value);
      });
      keys.map((key, i) => {
        const value = values[i];
        result.spec.push({ key, value });
      });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Orient' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.orientwatchusa.com",
    base: "https://www.orientwatchusa.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
