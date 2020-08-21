const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.rlxr-footer__wrapper div:nth-child(2) div ul li').each((idx, el) => {
      const href = $(el).find('a').attr('href');
      const name = $(el).find('a').text().trim();
      const url = base + href.replace(".html", "/all-models.html");
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.rlxr-watchgrid__watch-list-item ').each((idx, el) => {
        const href = $$(el).find('a').attr('href');
        const modelcase = $$(el).find('p').text().trim();
        const thumbnail = $$(el).find(' a img').attr('src');
        const collection = cat.name;
        result.items[cat.name].push({
          source: 'official',
          url: base + href,
          collection: collection,
          modelcase,
          thumbnail,
        })
      })
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Rolex' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, } = context;
    const result = {
      url: entry,
      spec: [],
      scripts: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('.rlxr-specs__reference').text().trim();
    const name = $('.rlxr-modelpage-majesty__watchname').text().trim();
    const description = $('.imageText__content--text').text().trim();
    const imageUrl = $('meta[property="og:image"]').attr('content');
    const collection = $('.rlx-breadcrumb__list li:nth-child(3) span ').text().trim();
    const retail = $('.rlxr-modelpage-majesty__price.display span').text().trim();
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.gender = 'X';
    result.imageUrl = imageUrl;
    result.collection = collection;
    result.retail = retail;
    $('.rlxr-specs__definition-content').each((idx, el) => {
      const key = $(el).find('.rlxr-specs__definition-title').text();
      const value = $(el).find(' .rlxr-specs__definition-desc').text().trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Rolex' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.rolex.com",
    base: "https://www.rolex.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.rolex.com/watches/day-date/m228238-0042.html",
      base: "https://www.rolex.com",
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

