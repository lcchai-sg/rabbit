const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { client, entry, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Chopard";
    const brandID = 44;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
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
      const { data } = await client.get(link);

      const jd = data.match(/categoryList\(.*\)/ig);
      if (jd) {
        const jdata = jd[0].match(/\[.*\]/g);
        const j = JSON.parse(jdata);
        j.forEach(j => {
          result.items[cat.name].push({
            source, lang, brand, brandID, url: j.url, collection: cat.name,
            name: j.name, reference: j.sku, price: j.price, thumbnail: j.small_image,
          });
        })
      }
    }
    /*
          const $$ = cheerio.load(data);
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
              source, lang, brand, brandID, url, collection: cat.name,
              name, reference, price: null, retail, thumbnail,
            });
          });
        }
    */
    return result;
  } catch (error) {
    console.log('Failed indexing class of brandId for Chopard with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  const { data } = await client.get(entry)
  const $ = cheerio.load(data);
  result.collection = $('meta[property="og:title"]').attr('content');
  result.thumbnail = $('meta[property="og:image"]').attr('content');
  result.description = $('.product.attribute.description').text().trim();
  if (result.url.match(/ladies/i)) result.gender = "F";
  else result.gender = "M";
  const movement = $('.tab.tab-label-movement').text().trim();
  if (movement) {
    result.spec.push({ key: "movement description", value: movement });
  }
  $('.additional-attributes-wrapper.table-wrapper ').each((idx, el) => {
    const keys = [];
    const values = [];
    $(el).find('.feature-title').each((idx, el) => {
      const key = $(el).text();
      keys.push(key);
    });
    $(el).find('.feature-value').each((idx, el) => {
      const value = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      values.push(value);
    });
    keys.map((key, i) => {
      result.spec.push({ key, value: values[i] });
    });
  });

  const d = data.match(/{"page".*}/ig);
  const j = d ? JSON.parse(d[0]) : null;
  let name = j.page.pageInfo.pageName.split('-')[0];
  result.name = name.split(' ').filter((val, idx, arr) => idx !== arr.length - 1).join(' ');
  if (j.product) {
    result.reference = j.product[0].productInfo.sku;
    result.price = j.product[0].price.currency + ' ' + j.product[0].price.basePrice;
  }
  return result;
};


(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.chopard.com/us/watches",
  // });
  // // console.log(r);
  // r.collections.forEach(c => {
  //   console.log('collection... ', c);
  //   r.items[c].forEach(v => {
  //     console.log(v);
  //   });
  // })

  const rr = [
    {
      source: 'official',
      lang: 'en',
      brand: 'Chopard',
      brandID: 44,
      url: 'https://www.chopard.com/us/ice-cube-124015-5001',
      collection: 'ICE CUBE',
      name: 'ICE CUBE',
      reference: '124015-5001',
      price: '$ 13,000',
      thumbnail: 'https://objects.chopard.com/media/catalog/product/cache/82209d6f8e09b86dfa28a1f01efe69a9/1/2/124015-5001_1.jpg'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Chopard',
      brandID: 44,
      url: 'https://www.chopard.com/us/imperiale-tourbillon-384250-5005',
      collection: 'IMPERIALE',
      name: 'IMPERIALE TOURBILLON',
      reference: '384250-5005',
      price: '',
      thumbnail: 'https://objects.chopard.com/media/catalog/product/cache/82209d6f8e09b86dfa28a1f01efe69a9/3/8/384250-5005_1.jpg'
    }
  ];

  const ex = await extraction({
    ...rr[0], entry: rr[0].url, client: axios,
  });
  console.log(ex);
})();