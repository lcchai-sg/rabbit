const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const collect = [];
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.sub-menu.col.col-3').each((idx, el) => {
      const index = idx;
      $(el).find('a').each((idx, x) => {
        let collection = '';
        let subcollection = '';
        let url = '';
        if (idx === 0) {
          collection = $(x).text();
          url = $(x).attr('href');
          collect.push({ index, collection, url });
        } else {
          subcollection = $(x).text();
          url = $(x).attr('href');
          const collection = collect[index].collection;
          cats.push({ collection, subcollection, url })
        }
      });
    });
    for (const cat of cats) {
      const subcollection = cat.subcollection;
      if (result.collections.indexOf(cat.collection) === -1) {
        result.collections.push({ collection: cat.collection, subcollection });
      }
      result.items[cat.collection] = [];
    }
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.products li > a').each((idx, el) => {
        const url = $(el).attr('href');
        const name = $(el).find(' .product-item figure .product-image img').attr('alt');
        const thumbnail = $(el).find(' .product-item figure .product-image img').attr('src');
        const retail = $(el).find(' .product-item .price-box .regular-price .price').text();
        let reference = '';
        const words = url.split('/');
        for (const word of words) {
          if (word.match(/html/i)) {
            reference = word.split('-')[0];
          }
        }
        result.items[cat.subCollection].push({
          url,
          thumbnail,
          collection: cat.collection,
          subcollection: cat.subCollection,
          name,
          reference,
          retail
        })
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Logines' +
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
    const reference = $('.sku ').text().trim();
    result.name = $('.product-name h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.regular-price ').text().trim();
    result.reference = reference;
    // result.collection = entry.split('/longines-collections/')[1].split('/')[1];
    result.gender = 'X';

    $('.product-info-tabs  div  div ul li').each((idx, el) => {
      const key = $(el).find('dt').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      let value = '';
      $(el).find('dd').each((idx, el) => {
        value += $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      });
      if (key) {
        result.spec.push({ key, value });
      }
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Logines ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.longines.com/en-us/watches/selector",
    base: "https://www.longines.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.longines.com/en-us/watch-the-longines-elegant-collection-l4-910-4-72-6",
      base: "https://www.longines.com",
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