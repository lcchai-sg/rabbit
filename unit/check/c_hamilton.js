const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const results = { collections: [], items: {} };
    const cats = [];

    const d = (await client.get(entry)).data;
    const $ = cheerio.load(d);
    $('li.item').each((idx, el) => {
      const url = $(el).find('button').attr('data-href');
      const txt = $(el).find('button').text().trim();
      if (url && url.indexOf('?cat=') > 0) {
        let td = txt.split('                                            ');
        let name = td[0];
        let nWatches = parseInt(td[1].split(' ')[0]);
        results.collections.push(name);
        results.items[name] = [];
        cats.push({ name, url, nWatches });
      }
    });

    const perPage = 12
    for (const cat of cats) {
      const numPages = Math.ceil(cat.nWatches / perPage);
      for (let i = 1; i <= numPages; i++) {
        const link = cat.url + '&p=' + i;
        console.log(link)
        const d = (await client.get(link)).data;
        const $ = cheerio.load(d);
        $('li.product-item').each((idx, el) => {
          const reference = $(el).attr('data-sku');
          const url = $(el).find('.product-item-photo').attr('href')
          const thumbnail = $(el).find('img').attr('data-src')
          const name = $(el).find('.product-name').text().trim();
          const retail = $(el).find('.price-wrapper').attr('data-price-amount');
          results.items[cat.name].push({
            url,
            thumbnail,
            collection: cat.name,
            name,
            reference,
            retail
          });
        });
        // return results;
      }
    }
    return results;
  } catch (error) {
    console.error('Failed for indexing class of Hamilton with error : ' + error);
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      reference: "",
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    $('script').each((_, el) => {
      let ty = $(el).attr('type');
      if (ty == 'application/ld+json') {
        const data = $(el).contents();
        let c = data['0']['data'];
        c = c.replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        c = JSON.parse(c);
        if (c['@type'] === 'Product') {
          result.name = c.name;
          result.description = c.description;
          if (typeof c.image === 'string') {
            result.thumbnail = c.image;
          } else {
            result.thumbnail = c.image[0];
          }
          result.reference = c.sku;
          result.gtin13 = c.gtin13;
          result.currency = c.offers.priceCurrency;
          result.price = result.retail = c.offers.price;
        }
      }
    });

    $('tr').each((_, el) => {
      const key = $(el).find('.data').attr('data-th');
      const value = $(el).find('.data').text().trim();
      result.spec.push({ key, value, })
    })
    return result;
  } catch (error) {
    console.error('Failed for extraction class of Hamilton ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.hamiltonwatch.com/en-us/collection.html",
    base: "https://www.hamiltonwatch.com/en-us/",
  };
  const r = await indexing(context);
  r.collections.forEach(col => {
    r.items[col].forEach(val => {
      console.log(val);
    })
  })
  // console.log(r.length)
  // if (r && r.items && r.collections) {
  //   const context = r.items[r.collections[0]][0];
  //   const e = await extraction(context);
  //   if (e.spec && e.spec.length > 0) {
  //     console.log(e)
  //   } else {
  //     console.log('extraction failed...')
  //   }
  // } else {
  //   console.log('indexing failed...')
  // }
})();