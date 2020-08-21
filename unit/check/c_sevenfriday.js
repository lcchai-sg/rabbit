const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { base, entry } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);

    $('ul.navigation-submenu[data-linklist="watches-0"] li').each((idx, el) => {
      if (idx >= 0 && idx < 7) {
        const name = $(el).find('a').text().trim();
        const url = base + $(el).find('a').attr('href');
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    console.log('cats>', cats)
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('#bc-sf-filter-products article').each((idx, el) => {
        const url = base + $$(el).find('a').attr('href');
        const name = $$(el).find('.product-list-item-title a').text();
        const thumbnail = 'https:' + $$(el).find('.product-list-item-thumbnail img').attr('src');
        const retail = $$(el).find('.product-list-item-price span.money').text().trim();
        const reference = $$(el).find('.product-list-item-thumbnail').attr('data-url') ? $$(el).find('.product-list-item-thumbnail').attr('data-url').split(/[,/]+/).pop() : '';

        result.items[cat.name].push({
          url,
          collection: cat.name,
          name,
          retail,
          thumbnail,
          reference,
        })
      })
      return result;
    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Sevenfriday' +
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
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.product-title').text().trim();
    result.collection = $('.product-tags').text().split('|')[1].trim() ? $('.product-tags').text().split('|')[1].trim() : '';
    result.retail = $('.product-price-minimum.money').text().trim();
    result.gender = 'M';
    result.description = $('.rte span').text().trim();
    result.thumbnail = 'https:' + $('.product-main-image img').attr('src');
    let box = $('.additional-information-element:nth-child(2) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    let spec_arr = [];
    let inner_box = box ? box.replace(/\n\n/g, "|").split("|") : [];
    inner_box.forEach(function (obj) {
      let split_obj = obj.split(":");
      spec_arr.push({
        "key": split_obj[0] ? split_obj[0].trim() : "",
        "value": split_obj[1] ? split_obj[1].trim() : ""
      });
    });
    result.spec = spec_arr;
    let interface_str = $('.additional-information-element:nth-child(3) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    result.feature = interface_str ? interface_str.replace(/\n\n/g, "|").split("|") : [];
    let nfc = $('.additional-information-element:nth-child(4) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    spec_arr.push({
      "key": "nfc",
      "value": nfc
    });
    let other_features = $('.additional-information-element:nth-child(5) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    let inner_other_features = other_features ? other_features.replace(/\n\n/g, "|").split("|") : [];
    inner_other_features.forEach(function (obj) {
      let split_obj = obj.split(":");
      spec_arr.push({
        "key": split_obj[0] ? split_obj[0].trim() : "",
        "value": split_obj[1] ? split_obj[1].trim() : ""
      });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Sevenfriday' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.sevenfriday.com/homepage.aspx",
    base: "https://www.sevenfriday.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.sevenfriday.com/collections/m-series/products/m1b-01m-urban-explorer",
      base: "https://www.sevenfriday.com",
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

