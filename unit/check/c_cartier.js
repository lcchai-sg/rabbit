const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { base, entry } = context;
    const result = { collections: [], items: {} };
    const menUrl = entry + 'mens-watches.html';
    const womenUrl = entry + '/women-s-watches.html';
    const cats = [];
    const $ = cheerio.load((await client.get(menUrl)).data);
    let gender = '';
    $('.slick-track a').each((idx, el) => {
      const name = $(el).find('.c-category-banner__caption').text().trim();
      const url = base + $(el).attr('href');
      gender = 'M';
      if (name) {
        cats.push({ name, url, gender });
        if (result.collections.indexOf(name) === -1) {
          result.collections.push(name);
          result.items[name] = [];
        }

      }
    });
    const $$ = cheerio.load((await client.get(womenUrl)).data);
    $$('.slick-track a').each((idx, el) => {
      const name = $(el).find('.c-category-banner__caption').text().trim();
      const url = base + $(el).attr('href');
      gender = 'F';
      if (name) {
        cats.push({ name, url, gender });
        if (result.collections.indexOf(name) === -1) {
          result.collections.push(name);
          result.items[name] = [];
        }
      }
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.col-sm-3.col-xs-6.grid-item-parent').each((idx, el) => {
        const url = base + $$(el).find('a').attr('href');
        const name = $$(el).find('a').attr('data-ga-product-name');
        const thumbnail = $$(el).find('.image-block img').attr('data-original');
        const reference = $$(el).find('a').attr('data-ga-product-ref');
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          reference,
          gender: cat.gender
        })
      })
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Cartier ' +
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
    result.description = $('div.tabbed-content__content-column > p.paragraph').text().trim();
    result.thumbnail = $('.c-image-adaptive').attr('data-original-url');
    let collect = '';
    if (entry.indexOf('mens-watches') > -1) {
      collect = entry.split("/mens-watches/")[1].split('/')[0];
      result.gender = 'M';
    } else {
      if (entry.indexOf('women-s-watches') > -1) {
        collect = entry.split("/women-s-watches/")[1].split('/')[0];
        result.gender = 'F';
      }
    }
    if (collect) {
      result.collection = collect;
    }
    result.name = $('.top-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.small-text.js-pdp__cta-section--product-ref-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split(":")[1];
    $('.tabbed-content__content-column').each((idx, el) => {
      const key = $(el).find('h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key) {
        result.spec.push({ key, value });
      }
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Cartier ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.en.cartier.com/collections/watches/",
    base: "https://www.en.cartier.com",
  };
  let r = await indexing(context);
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.en.cartier.com/collections/watches/selections/precious-watches/wgsa0012-santos-de-cartier-watch.html",
      base: "https://www.en.cartier.com",
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