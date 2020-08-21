const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { base, entry } = context;
    const result = { collections: [], items: {} };
    const cats = [
      {
        name: 'Men',
        // url: 'https://www.hermes.com/us/en/watches/men/#fh_view_size=72&country=us&fh_location=--%2Fcategories%3C%7Bwatchesmen%7D&fh_start_index=36|relevance|'
        url: "https://www.hermes.com/sg/en/category/men/watches/#||",
      },
      {
        name: 'Women',
        // url: 'https://www.hermes.com/us/en/watches/women/#fh_view_size=36&country=us&fh_location=--%2Fcategories%3C%7Bwatcheswomen%7D&fh_start_index=324|relevance|'
        url: "https://www.hermes.com/sg/en/category/women/watches/#||Category",
      }
    ];

    for (const cat of cats) {
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      console.log(result, cat.url)
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.product-grid-list-item').each((idx, el) => {
        const url = base + $$(el).find('.product-item a').attr('href');
        const name = $$(el).find('.product-item-meta').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const retail = $$(el).find('.product-item-price.ng-star-inserted').text().replace(',', '').trim();
        const reference = $$(el).find('.product-item-meta').attr('id').split('-').pop();
        result.items[cat.name].push({
          source: 'official',
          url,
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
    console.log('Failed for indexing class of Hermes ' +
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
    console.log('extraction>', context)
    const d = (await client.get(entry)).data;
    const $ = cheerio.load(d);
    result.thumbnail = 'https:' + $('.main-product-image ').attr('src');
    result.name = $('.product-title-container p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-sku').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace("Product reference:", "").trim();
    result.description = $('.field-item p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('See More', '').replace('See less', '').replace('…', '').trim();

    $('.toggle-content.ng-trigger.ng-trigger-toggleContent p').text().split(/<br\s*\/?>/i)[0]
      .split('\n').map((spec, idx) =>
        result.spec.push({ key: idx++, value: spec }));
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Hermes ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.hermes.com",
    base: "https://www.hermes.com",
  };
  const r = await indexing(context);
  console.log('indexing result>', r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][1];
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