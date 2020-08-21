const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const collections = [];
    const d = (await client.get(entry)).data;
    const $ = cheerio.load(d);
    $('.four-collections a.four-collections__link').each((idx, el) => {
      collections.push(base + $(el).attr('href'));
    });
    const urls = [];
    for (const url of collections) {
      const $ = cheerio.load((await client.get(url)).data);
      let collection = $('main h1').text();
      collection = collection.substr(0, collection.indexOf(" "));
      if (result.collections.indexOf(collection)) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
      $('section.product-list .product-list__item').each((idx, el) => {
        const $$ = cheerio.load(el);
        const href = $$('a').attr('href');
        const reference = $$('.product-list__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const n = $$('a h3').text();

        if (urls.indexOf(href) === -1) {
          urls.push(href);
          let url;
          let name = n.startsWith(collection) ? n.substr(collection.length + 1).trim() : n;
          if (href.indexOf('?') > -1) {
            url = href.substring(0, href.indexOf('?'));
          } else {
            url = href;
          }
          if (!url.startsWith('http') && base) {
            url = base + url.substr(1);
          }
          result.items[collection].push({
            url,
            reference,
            collection,
            name
          })
        }
      })
      return result;
    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Glashuette ' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = { url: entry, spec: [] };
    const $ = cheerio.load((await client.get(entry)).data);
    let collection = $('main .slider-main__inner .slider-main__item__subtitle:first-of-type').text().trim();
    collection = collection.substr(0, collection.indexOf(' '));
    let name = $('main .slider-main__inner h2').text().trim();
    result.collection = collection;
    result.name = name;
    result.thumbnail = base + ($('section.product[itemscope] .product__img a.product__link img').attr('data-src')).substr(1);
    $('section.product[itemscope] .product__info .product__info__item').each((idx, ele) => {
      let key = $(ele).find('h3').text().trim();
      let value = $(ele).find('.product__info__text > span').text().trim();
      result.spec.push({
        key,
        value
      });
      if (key === 'Reference Number') {
        result.reference = value;
      }
    });
    $('section.product.product--calibre .product__info__item').each((idx, ele) => {
      result.spec.push({
        group: 'calibre',
        key: $(ele).find('h3').text().trim(),
        value: $(ele).find('.product__info__text').text().trim()
      })
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Glashuette ' +
      ' with error : ' + error
    )
    return [];
  }
}

(async () => {
  const context = {
    entry: "https://www.glashuette-original.com/collection",
    base: "https://www.glashuette-original.com/",
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
