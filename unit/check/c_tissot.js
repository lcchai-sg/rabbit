const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const PageCount = 32;
    const catUrls = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.main-menu__submenu-item').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      catUrls.push({ name, url });
      if (result.collections.indexOf(name) === -1) {
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    console.log('catUrls>', catUrls)
    const urls = [];
    for (const cat of catUrls) {
      const c$ = cheerio.load((await client.get(cat.url)).data);
      const cTotal = parseInt(c$('.products-section .products-header .number-results .highlight').text());
      const cPage = Math.ceil(cTotal / PageCount);
      for (let i = 0; i < cPage; i++) {
        let $$;
        if (i === 0) {
          $$ = c$;
        } else {
          $$ = cheerio.load((await client.get(cat.url + '?p=' + (i + 1))).data);
        }

        $$('.products-section .products-grid').each((idx, el) => {
          const href = $$(el).find('a.product-thumbnail.product-item-link').attr('href');
          const name = $$(el).find('a.product-thumbnail.product-item-link').attr('title');
          let reference = '';
          let thumbnail = '';
          if (urls.indexOf(href) === -1) {
            urls.push(href);
          }
          if ($$(el).find('.product-thumbnail__img-container img').attr('src')) {
            const thumbnail = $$(el).find('.product-thumbnail__img-container img').attr('src');
            const words = thumbnail.split('/');
            for (const word of words) {
              const refs = word.split('_');
              for (const ref of refs) {
                if (ref.length === 18) {
                  reference = ref;
                }
              }
            }
          }

          result.items[cat.name].push({
            url: href,
            thumbnail,
            collection: cat.name,
            name,
            reference
          })
        })
        return result;
      }
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Tissot with error : ' + error)
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      spec: [],
      scripts: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('.product-sku').text().trim();
    const name = $('.product-name').text().trim();
    const retail = $('.price-wrapper').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const description = $('.product-description p').text().trim();
    result.thumbnail = $('.product-mosaic__img-container img').attr('src');
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.retail = retail;
    result.gender = 'X';

    $('.product-specs .tabs-container li').each((idx, el) => {
      const key = $(el).find('h4').text();
      const value = $(el).find('p').text();
      result.spec.push({ key, value });
    });
    $('.swiper-wrapper').each((idx, el) => {
      const ref = $(el).find('.swiper-slide a ').attr('href');
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Tissot with error : ' + error);
    return [];
  }
};

(async () => {
  const context = {
    entry:
      // "https://www.tissotwatches.com/en-en/shop/all-our-watches.html",
      "https://www.tissotwatches.com/en-en/collection.html",
    base: "https://www.tissotwatches.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.tissotwatches.com/en-en/shop/t1274071104100.html",
      base: "https://www.tissotwatches.com/",
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

