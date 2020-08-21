const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.pan-nav-item.pan-nav-item-collection-menu   .pan-nav-sub-item-wrapper  .pan-nav-sub-item-left .pan-nav-sub-item-left-wrapper .navigationitem .pan-sub-nav-item-wrapper').each((idx, el) => {
      const url = base + $(el).find('a').attr('href');
      const name = $(el).find('a').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.pan-prod-ref-container-bg  .pan-prod-ref-wrapper').each((idx, el) => {
        const href = $$(el).find('figure a').attr('href');
        const reference = $$(el).find('.pan-prod-ref-code').text().trim();
        const name = $$(el).find('.pan-prod-ref-name').text().trim();
        const thumbnails = $$(el).find(' figure a .pan-picture-tag img').attr('srcset');
        const retail = $$(el).find('.pan-prod-ref-price-wrapper .pan-prod-ref-price').text().trim();
        const collection = cat.name;
        const thumbnail = base + thumbnails;
        result.items[cat.name].push({
          url: base + href,
          collection: collection,
          reference,
          name,
          retail,
          thumbnail,
        });
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Panerai' +
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
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('.pan-ref-prod-id').text().trim();
    result.name = $('.pan-ref-detail-name').text().trim() + ' ' + reference;
    result.reference = reference;
    result.collection = entry.split('/watch-collection/')[1].split('/')[0];
    result.gender = 'M';
    $('.pan-technical-spec-inner').each((idx, el) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      $(el).find('h4').each((idx, el) => {
        key = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        keys.push(key);
      });
      $(el).find('p').each((idx, el) => {
        value = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        values.push(value);
      });
      keys.map((key, i) => {
        const value = values[i];
        result.spec.push({ key, value });
      });
    });
    $('.pan-product-carousel-wrapper').each((idx, el) => {
      let name = '';
      $(el).find('.pan-product-carousel-title').each((idx, el) => {
        name = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.related.push(name);
      });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Panerai' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.panerai.com/us/en",
    base: "https://www.panerai.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.panerai.com/us/en/collections/watch-collection/submersible/pam01055-submersible---42mm.html",
      base: "https://www.panerai.com",
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
