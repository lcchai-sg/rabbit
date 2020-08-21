const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.grid__item.grid__item--separator .grid.grid--multiline .grid__item').each((idx, el) => {
      if (idx > 0 && idx < 8) {
        const name = $(el).find('.card__body').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const url = $(el).find('a').attr('href');
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.grid__item ').each((idx, el) => {
        const url = $$(el).find('a').attr('href');
        const name = $$(el).find('.product__title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + $$(el).find('.product__reference').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $$(el).find('.box__body picture img').attr('data-src');
        const retail = $$(el).find('.price-from--prices').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const reference = $$(el).find('a').attr('data-tracking-product');
        if (reference) {
          result.items[cat.name].push({
            source: 'official',
            url,
            thumbnail,
            collection: cat.name,
            name,
            reference,
            retail
          });
        }
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Piaget' +
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
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.description = $('.accordion__body p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = $('.media__body h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-page-ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.country-reveal-container.product-page-price .price-from--prices').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.definitions__item').each((idx, el) => {
      const key = $(el).find('dt').text().trim();
      const value = $(el).find('dd').text().trim();
      result.spec.push({ key, value });
    });

    $('.container li .collapsible .accordion__body h3').each((idx, el) => {
      if (idx === 1) {
        const caliber = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace(/movement/i, '').trim();
        if (caliber) {
          const key = 'Caliber';
          const value = caliber;
          result.spec.push({ key, value });
        }
      }
    });
    $('.product__reference').each((idx, el) => {
      const ref = $(el).text().trim();
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Piaget' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.piaget.com/watches/all-watches",
    base: "https://www.piaget.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.piaget.com/watches/altiplano/white-gold-ultra-thin-mechanical-watch-g0a29112",
      base: "https://www.piaget.com/",
    }
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
