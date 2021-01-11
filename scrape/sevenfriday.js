const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('ul.navigation-submenu[data-linklist="watches-0"] li').each((idx, el) => {
      if (idx >= 0 && idx < 7) {
        const name = $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').split('>')[1].trim();
        const url = base + $(el).find('a').attr('href');
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      let next = cat.url;
      do {
        console.log(next);
        const $$ = cheerio.load((await client.get(next)).data);
        $$('#bc-sf-filter-products article').each((idx, el) => {
          const url = base + $$(el).find('a').attr('href');
          const name = $$(el).find('.product-list-item-title a').text();
          const thumbnail = 'https:' + $$(el).find('.product-list-item-thumbnail img').attr('src');
          const price = $$(el).find('.product-list-item-price span.money').text().trim();
          const reference = $$(el).find('.product-list-item-thumbnail').attr('data-url') ? $$(el).find('.product-list-item-thumbnail').attr('data-url').split(/[,/]+/).pop().toUpperCase() : '';

          result.items[cat.name].push({
            url, collection: cat.name,
            name, reference, price, thumbnail,
          })
        })
        next = $$("link[rel='next']").attr('href');
        if (next) next = base + next;
      } while (next);
    }
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Seven Friday with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.product-title').text().trim();
    result.collection = $('.breadcrumbs').text().split('/')[2].trim();
    result.retail = $('.product-price-minimum.money').text().trim();
    result.gender = 'M';
    result.description = $('.rte span').text().trim();
    result.thumbnail = 'https:' + $('.product-main-image img').attr('src');
    // let box = $('.additional-information-element:nth-child(2) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    // let spec_arr = [];
    // let inner_box = box ? box.replace(/\n\n/g, "|").split("|") : [];
    // inner_box.forEach(function (obj) {
    //   let split_obj = obj.split(":");
    //   spec_arr.push({
    //     "key": split_obj[0] ? split_obj[0].trim() : "",
    //     "value": split_obj[1] ? split_obj[1].trim() : ""
    //   });
    // });
    // result.spec = spec_arr;
    // let interface_str = $('.additional-information-element:nth-child(3) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    // result.feature = interface_str ? interface_str.replace(/\n\n/g, "|").split("|") : [];
    // let nfc = $('.additional-information-element:nth-child(4) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    // spec_arr.push({
    //   "key": "nfc",
    //   "value": nfc
    // });
    // let other_features = $('.additional-information-element:nth-child(5) .custom-field.custom-field__box.custom-field__type--html').find('p:nth-child(3)').text();
    // let inner_other_features = other_features ? other_features.replace(/\n\n/g, "|").split("|") : [];
    // inner_other_features.forEach(function (obj) {
    //   let split_obj = obj.split(":");
    //   spec_arr.push({
    //     "key": split_obj[0] ? split_obj[0].trim() : "",
    //     "value": split_obj[1] ? split_obj[1].trim() : ""
    //   });
    // });

    $('.additional-information-element').each((idx, el) => {
      let process = true;
      if (idx !== 0) {
        const key = $(el).find('h2').text();
        $(el).find('p').each((idx, el) => {
          const v = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ');
          v.forEach(value => {
            if (value.match(/sunglass/i)) process = false;
            if (process && value.trim() && !value.match(/watch:/i)) result.spec.push({ key, value });
          })
        })
      }
    })
    $('.product__specification').find('li').each((idx, el) => {
      const key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ')[0];
      // const key = $(el).text();
      $(el).find('p').each((idx, el) => {
        const v = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ');
        v.forEach(value => {
          // const v = value.match(/:/) ? value.split(":") : [value];
          // if (v.length === 1) result.spec.push({ key, value: v[0] });
          // else if (v[0]) result.spec.push({ key: v[0], value: v[1] });
          // else result.spec.push({ key, value: v[1] });
          if (value.trim()) result.spec.push({ key, value });
        })
      })
    });
    $('.product__other-features').find('li').each((idx, el) => {
      const key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ')[0];
      $(el).find('p').each((idx, el) => {
        const v = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ');
        v.forEach(value => {
          // const v = (value.match(/:/)) ? value.split(":") : [value];
          // if (v.length === 1) result.spec.push({ key, value: v[0] });
          // else if (v[0]) result.spec.push({ key: v[0], value: v[1] });
          // else result.spec.push({ key, value: v[1] });
          if (value.trim()) result.spec.push({ key, value });
        })
      })
    });
  } catch (error) {
    console.log('Failed extraction for Sevenfriday with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.sevenfriday.com/homepage.aspx",
    brandID: 142,
    brand: "Seven Friday",
    base: "https://www.sevenfriday.com",
  });
  // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => console.log(w));
  // })

  // const rr = [
  //   "https://www.sevenfriday.com/collections/m-series/products/m3-03-psycho",
  //   "https://www.sevenfriday.com/collections/m-series/products/sf-m2b-01",
  //   "https://www.sevenfriday.com/collections/p-series/products/p3c-04-red-carbon",
  //   "https://www.sevenfriday.com/collections/p-series/products/p3c-07-white-carbon",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Seven Friday",
  //     brandID: 142,
  //   })
  //   console.log(ex.url);
  //   ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
  //   console.log()
  //   console.log()
  // }

  // for (let i = 0; i < 1; i++) {
  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        ...r.items[c][j],
        client: axios,
        entry: r.items[c][j].url,
      });
      console.log(ex.url);
      ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
      console.log()
      console.log()
    }
  }
})();