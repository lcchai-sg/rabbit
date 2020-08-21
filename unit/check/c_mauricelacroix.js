const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const pages = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.navigation ul li ul li').each((idx, el) => {
      if (idx < 6) {
        const name = $(el).text();
        const url = $(el).find('a').attr('href');
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url })
      }
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.item.product.product-item').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        const name = $(el).find('.product.name.product-item-name').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('a img').attr('src');
        const retail = $(el).find('.price').text().trim();
        const reference = $(el).find('.product-item-sku').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          reference,
          retail
        });
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Maurice Lacroix' +
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
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.page-title-wrapper.product h1').text().trim();
    result.reference = $('.product.attribute.sku .value').text().trim();
    result.description = $('.description p').text().trim();
    result.gender = 'M';
    $('.price-box.price-final_price .price-container .price').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().trim();
      }
    });
    $('.product.attribute ').each((idx, el) => {
      const key = $(el).find('.type').text().trim();
      const value = $(el).find('.value').text().trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Maurice Lacroix' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.mauricelacroix.com/us_en/watches",
    base: "https://www.mauricelacroix.com",
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
