const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.mb-header-subnav-item a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      let url = base + $(el).attr('href');
      if (url.indexOf('/collection/watches/') > 0) {
        cats.push({ name, url });
      }
      // console.log(idx, name, url)
      // if (idx > 75 && idx < 83) {
      //   const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      //   let url = base + $(el).attr('href');
      //   if (url.match(/filter/i)) {
      //     url = url.split('?')[0]
      //     cats.push({ name, url });
      //   }
      //   else {
      //     cats.push({ name, url });
      //   }
      //   result.collections.push(name);
      //   result.items[name] = [];
      // }
    });
    console.log('indexing cats>', cats)
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.mb-prod-tile .mb-prod-tile-section').each((idx, el) => {
        const url = base + $(el).find('.mb-prod-tile-desc-wrapper a').attr('href');
        const name = $(el).find('.mb-prod-tile-desc-wrapper a').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = base + $(el).find('.mb-prod-tile-image').attr('src');
        const retail = $(el).find('.mb-prod-tile-price').text().trim();
        const reference = url.split('/').pop().split('-')[0];
        result.items[cat.name].push({
          url,
          thumbnail,
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
    console.log('Failed for indexing class of Mont Blanc' +
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
    result.name = $('.mb-pdp-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.mb-pdp-price-wrapper').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.collection = entry.split('/watches/')[1].split('/')[0];
    result.description = $('.mb-tab-content-default').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.mb-pdp-prod-ident').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = 'M';
    result.thumbnail = base + $('.mb-pdp-carousel-item-img').attr('src');
    let key = '';
    let value = '';
    const keys = [];
    const values = [];
    let materialCount = 1;
    $('.mb-pdp-feature-column dt').each((idx, el) => {
      key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key === 'Material') {
        key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + materialCount;
        materialCount++;
      }
      if (key === '') {
        key = 'weight';
        keys.push(key);
      }
      else {
        keys.push(key);
      }
    });
    $('.mb-pdp-feature-column dd').each((idx, el) => {
      value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (value) {
        values.push(value);
      }
    });
    keys.map((key, i) => {
      const value = values[i];
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Mont Blanc' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.montblanc.com/en-shop/categories/watches.html",
    base: "https://www.montblanc.com",
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