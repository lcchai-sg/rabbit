const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const $ = cheerio.load((await client.get(entry)).data);
    const cats = [];

    $('.nav-2367 .menu-element-sub-menu ').each((idx, el) => {
      let url = '';
      let name = '';
      const urls = [];
      const names = [];
      $(el).find('a').each((idx, el) => {
        url = $(el).attr('href');
        urls.push(url);
      });
      $(el).find('li .menu-element a').each((idx, el) => {
        name = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        names.push(name);
      });
      urls.map((url, i) => {
        const name = names[i];
        if (name !== 'VIEW ALL PRODUCTS') {
          cats.push({ name, url });
        }
      });
    });
    $('.nav-2368 .menu-element-sub-menu ').each((idx, el) => {
      let url = '';
      let name = '';
      const urls = [];
      const names = [];
      $(el).find('a').each((idx, el) => {
        url = $(el).attr('href');
        urls.push(url);
      });
      $(el).find('li .menu-element a').each((idx, el) => {
        name = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        names.push(name);
      });
      urls.map((url, i) => {
        const name = names[i];
        if (name !== 'VIEW ALL PRODUCTS') {
          cats.push({ name, url });
        }
      });
    });
    for (const cat of cats) {
      if (result.collections.indexOf(cat.name) === -1) {
        result.collections.push(cat.name);
        result.items[cat.name] = [];
      }
    }
    for (const cat of cats) {
      const link = cat.url;
      console.log(link)
      const $$ = cheerio.load((await client.get(link)).data);
      $$('.products-grid li').each((idx, el) => {
        let reference = '';
        let thumbnail = '';
        const url = $$(el).find('.border-container a').attr('href');;
        const productName = $$(el).find('.product-name').text();
        const productSubnaame = $$(el).find('.product-subname').text();
        const name = productName + ' ' + productSubnaame;
        const retail = $$(el).find('.price-box .price-container .price').text().trim();
        if ($$(el).find('.product-image-wrapper img').attr('src')) {
          thumbnail = $$(el).find('.product-image-wrapper img').attr('src')
          const refs = thumbnail.split('/');
          for (const ref of refs) {
            const refVal = ref.split('_');
            for (const val of refVal) {
              if (val.length === 11) {
                reference = val;
              }
            }
          }
        }
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
  }
  catch (error) {
    console.log('Failed for indexing class of Chopard ' +
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
      scripts: [],
      related: []
    };
    console.log(entry)
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = entry.slice(-11);
    const name = $('.page-title-wrapperproduct').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    const description = $('.product.attribute.description').text().trim();
    const movement = $('.tab.tab-label-movement').text().trim();
    if (movement) {
      result.spec.push({
        key: "movement description",
        value: movement
      });
    }

    let gender;
    if (result.url.match(/ladies/)) {
      gender = "F"
    } else {
      gender = "M"
    }
    result.url = entry;
    result.gender = gender;
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.retail = $('.price-box.price-final_price').text().trim();
    $('.additional-attributes-wrapper.table-wrapper ').each((idx, el) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      $(el).find('.feature-title').each((idx, el) => {
        key = $(el).text();
        keys.push(key);
      });
      $(el).find('.feature-value').each((idx, el) => {
        value = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        values.push(value);
      });
      keys.map((key, i) => {
        const value = values[i];
        result.spec.push({ key, value });
      });
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Chopard ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.chopard.com/us/watches",
    base: "https://www.chopard.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.chopard.com/us/watches/ladies-watches/happy-sport/happy-hearts-278582-3005",
      base: "https://www.chopard.com",
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
