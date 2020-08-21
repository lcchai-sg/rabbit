const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.header__primary__links.header__primary__links1 .js-header-entry .header__column  li').each((idx, el) => {
      if (idx > 55 && idx < 63) {
        const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const url = base + $(el).find('a').attr('href');
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.product-grid__item.js-product-edito ').each((idx, el) => {
        const url = base + $(el).find('.txt-product a').attr('href');
        const name = $(el).find('.heading.is-7.is-block.txt-product__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('.product__media img').attr('src');
        const reference = $(el).find('.is-sr-only').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref.', '').trim();
        const retail = $(el).find('.is-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('*', '').trim();
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          reference,
          retail
        });
      });
    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Chanel ' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = { url: entry, scripts: [], spec: [], related: [] };
    const $ = cheerio.load((await client.get(entry)).data);
    let key = $('.product-details__option').find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    let value = $('.product-details__option').find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.spec.push({ key, value });
    result.name = $('.heading.product-details__title ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-details__reference').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref.', '').trim();
    result.description = $('.product-details__description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.pdp-sticky__pricing .product-details__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('*', '').trim();
    result.gender = 'F';
    result.thumbnail = $('.carousel__slide-container img').attr('data-src');
    $('.characteristics__characteristic li').each((idx, el) => {
      key = $(el).find('.heading.is-7').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Chanel ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.chanel.com/us/",
    base: "https://www.chanel.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[1]][0];
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
