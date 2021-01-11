const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  try {
    const client = axios;
    const entry = "https://www.ulysse-nardin.com/row_en/";
    const source = "official";
    const brand = "Ulysse Nardin";
    const brandID = 162;
    const lang = "en";
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.un-c-megaMenu__sub-menu li a').each((idx, el) => {
      // if (idx > 0 && idx < 6) {
      const name = $(el).text().trim();
      if (name.match(/\bcollection\b/i)) {
        const url = $(el).attr('href');
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url });
      }
      // }
    });
    console.log(cats);
    return result;
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      // const amount = $$('.un-c-filter__total').text().replace('Watches', '').trim();
      const amount = $$('#toolbar-number-product-count').text().replace('Watches', '').trim();
      const PAGE = Math.ceil(parseInt(amount) / 9);
      for (let i = 1; i <= PAGE; i++) {
        const link = cat.url + '?p=' + i;
        console.log(link);
        const { data } = await client.get(link);
        const $$ = cheerio.load(data);
        $$('.un-c-product.product-item').each((idx, el) => {
          const url = $$(el).find('.un-c-product__item a').attr('href');
          if (url) {
            const thumbnail = $$(el).find('.un-c-product__item a img').attr('src');
            const name = $$(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const retail = $$(el).find('.price-box.price-final_price').text().trim();
            let reference = '';
            const words = url.split('/');
            for (const word of words) {
              if (word.match(/html/i)) {
                const ref = word.replace('.html', '').toUpperCase().split('-');
                reference = ref.slice(0, ref.length - 1).join('-') + '/' + ref[ref.length - 1];
              }
            }
            result.items[cat.name].push({
              source, lang, brand, brandID, url, collection: cat.name,
              name, reference, retail, thumbnail,
            });
          }
        });
      }

      // if (PAGE > 1) {
      //   let current = 1;
      //   do {
      //     const link = cat.url + ((current > 0) ? '?p=' + current : '?p=1');
      //     const $$ = cheerio.load((await client.get(link)).data);
      //     $$('.un-c-product.product-item').each((idx, el) => {
      //       const url = $$(el).find('.un-c-product__item a').attr('href');
      //       const thumbnail = $$(el).find('.un-c-product__item a img').attr('src');
      //       const name = $$(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      //       const retail = $$(el).find('.price-box.price-final_price').text().trim();
      //       let reference = '';
      //       const words = url.split('/');
      //       for (const word of words) {
      //         if (word.match(/html/i)) {
      //           reference = word.replace('.html', '');
      //         }
      //       }
      //       result.items[cat.name].push({
      //         source, lang, brand, brandID, url, collection: cat.name,
      //         name, reference, retail, thumbnail,
      //       });
      //     });
      //     current++;
      //   }
      //   while (current < (PAGE + 1))
      // } else {
      //   const $$ = cheerio.load((await client.get(cat.url)).data);
      //   $$('.un-c-product.product-item').each((idx, el) => {
      //     const url = $$(el).find('.un-c-product__item a').attr('href');
      //     const thumbnail = $$(el).find('.un-c-product__item a img').attr('src');
      //     const name = $$(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      //     const retail = $$(el).find('.price-box.price-final_price').text().trim();
      //     let reference = '';
      //     const words = url.split('/');
      //     for (const word of words) {
      //       if (word.match(/html/i)) {
      //         reference = word.replace('.html', '');
      //       }
      //     }
      //     result.items[cat.name].push({
      //       source, lang, brand, brandID, url, collection: cat.name,
      //       name, reference, retail, thumbnail,
      //     });
      //   });
      // }
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Ulysse Nardin with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  try {
    const { client, url: entry, source, lang, brand, brandID, name, reference, collection, retail, thumbnail } = context;
    const result = {
      source, lang, brand, brandID, url: entry,
      collection, name, reference, thumbnail, retail,
      scripts: [], spec: [], related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    // result.collection = '';
    // result.name = $('.un-c-pdp-content__wishlist>h2').text();
    // result.reference = '';
    // result.gender = result.name.match(/lady/i) ? 'F' : 'M';
    result.retail = $('.price-box.price-final_price').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = $(".col-md-6.bg-light.text-center").find('img').attr('src');
    $('script[type="text/x-magento-init"]').each((idx, el) => {
      const d = $(el).contents().toString();
      if (d.match(/product-detail/i)) {
        const j = JSON.parse(d);
        const pd = j['*']['Magento_GoogleTagManager/js/actions/product-detail'];
        result.reference = pd.reference;
        result.name = pd.name;
        result.collection = pd.collection;
        result.color = pd.color;
        result.gender = pd.watch_gender;
        result.case_material = pd.case_material;
        result.case_diameter = pd.case_diameter;
        result.collection = pd.collection;
        // result.gender = Mappers.getGender.map(pd.gender);
      }
    });
    $('.d-flex.flex-wrap.small.no-gutters .mt-4 ').each((idx, el) => {
      const key = $(el).find('span').text();
      const value = $(el).text().replace(key, '').trim();
      if (value) result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    const { source, lang, entry, } = context;
    console.error('Failed extraction for Ulysse Nardin with error : ' + error);
    console.error(entry);
    return { source, lang, url: entry, code: error.response.status, };
  }
};

(async () => {
  // const r = await indexing();
  // console.log(r)
  // r.collections.forEach(c => {
  //   r.items[c].forEach(v => console.log(v));
  // })
  // process.exit(0)
  const u = [
    {
      source: 'official',
      lang: 'en',
      brand: 'Ulysse Nardin',
      brandID: 162,
      url: 'https://www.ulysse-nardin.com/row_en/1183-126-7m-43.html',
      // collection: 'Marine Collection',
      // name: 'Marine Chronometer 43 mm',
      // reference: '1183-126-7m-43',
      // retail: '$11,300',
      // thumbnail: 'https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_1183-126-7M_43_Watc.png'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Ulysse Nardin',
      brandID: 162,
      url: 'https://www.ulysse-nardin.com/row_en/1183-126-3-42.html',
      // collection: 'Marine Collection',
      // name: 'Marine Chronometer 43 mm',
      // reference: '1183-126-3-42',
      // retail: '$10,300',
      // thumbnail: 'https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_1183-126-3_42_Watc.png'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Ulysse Nardin',
      brandID: 162,
      url: 'https://www.ulysse-nardin.com/row_en/1186-126-43.html',
      // collection: 'Marine Collection',
      // name: 'Marine Chronometer 43 mm',
      // reference: '1186-126-43',
      // retail: '$29,800',
      // thumbnail: 'https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_1186-126_43_Watc.png'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Ulysse Nardin',
      brandID: 162,
      url: 'https://www.ulysse-nardin.com/row_en/1186-126-3-43.html',
      // collection: 'Marine Collection',
      // name: 'Marine Chronometer 43 mm',
      // reference: '1186-126-3-43',
      // retail: '$31,800',
      // thumbnail: 'https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_1186-126-3_43_Watc.png'
    }
  ]

  for (let i = 0; i < u.length; i++) {
    const ex = await extraction({
      client: axios,
      ...u[i]
    });
    console.log(ex);
  }
})();