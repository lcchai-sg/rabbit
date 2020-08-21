const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const temps = [];
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.views-row a').each((idx, element) => {
      if (idx > 1 && idx < 6) {
        const url = base + $(element).attr('href');
        const name = $(element).find('.cl_teaser__title').text();
        temps.push({ name, url })
      }
    });
    for (const temp of temps) {
      const $$ = cheerio.load((await client.get(temp.url)).data);
      $$('.views-row a').each((idx, element) => {
        const url = base + $(element).attr('href');
        const subCollection = $(element).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        if (subCollection) {
          cats.push({ collection: temp.name, subCollection, url });
          result.collections.push({ collection: temp.name, subCollection });
          result.items[temp.name + ' ' + subCollection] = [];
        }
      });
    }
    for (const cat of cats) {
      console.log(cat.url)
      const $$$ = cheerio.load((await client.get(cat.url)).data);
      $$$('.ts_watch__tile.js_watch_link').each((idx, el) => {
        console.log('idx>', idx)
        const url = base + $$$(el).attr('href');
        const thumbnail = base + $$$(el).find('a img').attr('src');
        const name = $$$(el).attr('data-name');
        const retail = 'CHF ' + $$$(el).find('a .ts_watch__price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace(/[^0-9]/g, '').trim();
        const reference = $$$(el).attr('data-sku');
        result.items[cat.collection + ' ' + cat.subCollection].push({
          name,
          reference,
          url,
          thumbnail,
          collection: cat.collection,
          subCollection: cat.subCollection,
          retail
        });
      });
      return result;
    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Hublot ' +
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
      spec: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const collection = $('main header h1 .sup-title-dashed').text().trim();
    const name = $('main header h1').text().trim().substr(collection.length + 1).trim();
    const retail = $('main header .page-header__price > span').text();
    const subCollection = $('.block-related-products h2').text().trim();

    result.collection = collection;
    result.name = name;
    result.retail = retail;
    result.subCollection = subCollection;

    $("#content script").each((idx, ele) => {
      result.scripts.push($(ele.children[0]).text());
    });
    $('.block-technical .block-technical__item').each((idx, ele) => {
      const group = $(ele).find('.panel-heading h3').text();
      const attributes = [];
      $(ele).find('.vertical-list__sub-list .vertical-list__item').each((ix, el) => {
        if (idx === 0 && ix === 0) {
          result.reference = $(el).find('p').text().trim();
        }
        attributes.push(
          {
            key: $(el).find('h4').text(),
            value: $(el).find('p').text()
          }
        )
      });
      result.spec.push({
        group,
        attributes
      })
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Hublot ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.hublot.com/en-us/watches",
    base: "https://www.hublot.com",
  };
  const r = await indexing(context);
  console.log('indexing result>', r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][1];
    const context = {
      url: "https://www.hublot.com/en-us/watches/classic-fusion/classic-fusion-titanium-rubber-45-mm",
      base: "https://www.hublot.com",
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