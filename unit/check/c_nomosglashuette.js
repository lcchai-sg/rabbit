const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { base, entry } = context;
    const result = { collections: [], items: {} };
    const $ = cheerio.load((await client.get(entry)).data);
    $('.product-group.product-group--store a').each((idx, el) => {
      const collection = $(el).attr('data-category');
      if (result.collections.indexOf(collection) < 0) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
    });
    $('.product-group.product-group--store a').each((idx, el) => {
      const url = base + $(el).attr('href');
      const name = $(el).attr('title');
      const thumbnail = $(el).find('.media-box-wrapper img').attr('data-src');
      const retail = $(el).find('.price--default ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const collection = $(el).attr('data-category');
      const reference = $(el).find('.teaser__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

      result.items[collection].push({
        url,
        thumbnail,
        collection,
        name,
        reference,
        retail
      });
    });
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Nomos Glashuette' + brandID +
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
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.head-wrapper h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.product--price.price--default').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product__main-ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.product-description .text-container.text-big p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.specs-list dl').each((idx, el) => {
      const key = $(el).find('dt').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('dd').text().replace(/^\s+|\n|\s+$/gm, '').trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Nomos Glashuette' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://nomos-glashuette.com/en/watchfinder",
    base: "https://nomos-glashuette.com",
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
