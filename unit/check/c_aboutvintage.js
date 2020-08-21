const client = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  try {
    const entry = "https://aboutvintage.com/collections/";
    const base = "https://aboutvintage.com";
    const result = { collections: [], items: {} };
    const cats = [
      {
        name: 'Men',
        url: entry + 'all',
        gender: 'M'
      },
      {
        name: 'Women',
        url: entry + 'women',
        gender: 'F'
      }
    ];
    for (const cat of cats) {
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      if (cat.name === 'Men') {
        let current = 0;
        do {
          current++;
          const link = cat.url + ((current > 0) ? '?page=' + current : '');
          const $ = cheerio.load((await client.get(link)).data);
          $('.grid__item.grid-product.small--one-half').each((idx, el) => {
            const url = base + $(el).find('.grid-product__content a').attr('href');
            const thumbnail = 'https:' + $(el).find('.image-wrap img').attr('data-src').replace('{width}', '400');
            const name = $(el).find('.image-wrap img').attr('alt');
            const retail = $(el).find('.grid-product__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.items[cat.name].push({
              url,
              thumbnail,
              collection: cat.name,
              name,
              gender: cat.gender,
              retail
            });
          });
        }
        while (current < 2)
      }
      else {
        const $ = cheerio.load((await client.get(cat.url)).data);
        $('.grid__item.grid-product.small--one-half').each((idx, el) => {
          const url = base + $(el).find('.grid-product__content a').attr('href');
          const thumbnail = 'https:' + $(el).find('.image-wrap img').attr('data-src').replace('{width}', '400');
          const name = $(el).find('.image-wrap img').attr('alt');
          const retail = $(el).find('.grid-product__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          result.items[cat.name].push({
            url,
            thumbnail,
            collection: cat.name,
            name,
            gender: cat.gender,
            retail
          });
        });
      }
    }
    return result;
  }
  catch (error) {
    const { brand, brandID } = context;
    console.log('Failed for indexing class of brandId : ' + brandID +
      ' ,brand ' + brand +
      ' with error : ' + error
    )
    const result = [];
    return result;
  }
};

const extraction = async (context) => {
  try {
    const { url } = context;
    const result = { ...context, spec: [], };
    const $ = cheerio.load((await client.get(url)).data);
    result.retail = $('.product__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.product-single__description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.product-single__tech-specs-content').each((idx, el) => {
      const key = $(el).find('h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value })
    });
    return result;
  }
  catch (error) {
    const { brand, brandID, entry } = context;
    console.log('Failed for extraction class of brandId : ' + brandID +
      ' ,brand : ' + brand +
      ' ,url : ' + entry +
      ' with error : ' + error
    )
    const result = [];
    return result;
  }
};

(async () => {
  const r = await indexing();
  if (r && r.items && r.items.Men && r.items.Men.length > 0) {
    const e = await extraction(r.items.Men[0]);

    if (e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();