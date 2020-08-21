const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.dropdown_product_cat option').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').replace(/\d+/g, '').replace('()', '');
      const count = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').replace(/^\D+/g, '').replace(')', '');
      const pages = Math.ceil(parseInt(count) / 15);
      const url = base + '/collections/' + $(el).attr('value');
      if (idx > 1) {
        cats.push({ name, url, pages });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.products.clearfix li').each((idx, el) => {
        const url = $(el).find('.product-link').attr('href');
        const name = $(el).find('.block.block-cat').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        const thumbnail = $(el).find('img').attr('data-src');
        const reference = $(el).find('.block.block-cat small').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        const retail = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.items[cat.name].push({
          source: 'official',
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
  }
  catch (error) {
    console.log('Failed for indexing class of Frederique Constant ' +
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
    result.retail = $('.row .price .woocommerce-Price-amount.amount').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = $('.product-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = $('.woocommerce-product-gallery__wrapper img').attr('src');

    $('.row .col-sm-6.col-xs-12.product-summary h5').each((idx, el) => {
      if (idx === 0) {
        result.reference = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
    if (entry.indexOf(/ladies/i) > -1) {
      result.gender = 'F'
    }
    else {
      result.gender = 'M'
    }
    result.collection = entry.split('/watch-finder/')[1].split('/')[0];
    $('.block.block-cat small').each((idx, el) => {
      const related = $(el).text();
      if (related) {
        result.related.push(related);
      }
    });
    $('.col-xs-12.col-md-6 div').each((idx, el) => {
      const key = $(el).find('h4').text();
      const value = $(el).text().replace(key, '');
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Frederique Constant ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.frederiqueconstant.com/watch-finder/",
    base: "https://www.frederiqueconstant.com",
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
