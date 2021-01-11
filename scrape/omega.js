const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Omega";
  const brandID = 20;
  const { client, entry, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const PageCount = 24;
  const cats = [];
  let id = 0;
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $(".ow-collection__list-item").each((idx, el) => {
      const subCollection = $(el).find("a").text().replace(/\s+/g, ' ').trim();
      const href = $(el).find("a").attr("href");
      const coll = href.split('/')[5];
      const collection = coll[0].toUpperCase() + coll.slice(1);
      const url = href.replace("/product", "/catalog");
      const cname = collection + '  ' + subCollection;
      result.collections.push({ collection, subCollection });
      result.items[cname] = [];
      cats.push({ cname, url });
    })
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      const count = parseInt($('span#cat_number').attr('data-counter'));
      const totalPage = Math.ceil(count / PageCount);
      for (let i = 1; i <= totalPage; i++) {
        const link = cat.url + '?p=' + i;
        console.debug(link);
        const { data } = await client.get(link);
        const _$ = cheerio.load(data);
        _$('.product-item').each((idx, el) => {
          const url = _$(el).find('a').attr('href');
          const th = _$(el).find('source').attr('data-srcset');
          const thumbnail = th.split(' ')[0];
          const ref = _$(el).find('img').attr('alt');
          const refr = ref.split(';');
          const refrn = refr[refr.length - 1].split('-');
          const reference = refrn[refrn.length - 1].trim();
          const name = _$(el).find('.ow-prod__desc').find('p').text().split('\n')[0].trim();
          const price = _$(el).find('.price').text().trim();
          const collection = cat.cname.split('  ')[0];
          const subCollection = cat.cname.split('  ')[1];
          result.items[cat.cname].push({
            source, lang, brand, brandID, url, collection, subCollection,
            name, reference, price, thumbnail,
          });
        })
      }
      return result;
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Omega with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, lang, ...rest } = context;
  const result = { ...rest, lang, url: entry, spec: [], related: [], variations: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    // result.name = $('.product.attribute.name').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    // result.reference = $('.product-info-sku').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    // result.description = $('.description-wrapper').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = 'M';
    // result.thumbnail = $('meta[property="og:image"]').attr('content');
    $('script[type="application/ld+json"]').each((idx, el) => {
      const c = $(el).contents().toString();
      const j = JSON.parse(c);
      console.log(j)
      if ((j['@type']) === 'Product') {
        result.name = j.name;
        result.thumbnail = j.image;
        result.reference = j.sku;
        result.description = j.description;
        if (j.offers) result.price = j.offers.priceCurrency + ' ' + j.offers.price;
      }
    })

    $('.pm-feature-tooltip a').each((idx, el) => {
      const key = 'Features';
      const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    $('.product-info-data-content.technical-data.watches li').each((idx, el) => {
      const key = $(el).find('strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    $('.pm-grid-center.pm-module-37-title').each((idx, el) => {
      const key = 'Caliber...';
      const value = $(el).find('h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    $('.pm-module-37-pictos li').each((idx, el) => {
      const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (value.match(/hours/i)) {
        const key = 'Power Reserve';
        result.spec.push({ key, value });
      } else {
        const key = 'Caliber Type';
        result.spec.push({ key, value });
      }
    });
    {
      const value = $('#ow-mod_caliber_product_page').find('.pm-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const key = 'caliber_ref';
      result.spec.push({ key, value });
    }
    {
      const value = $('#ow-mod_caliber_product_page').find('.pm-text').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const key = 'caliber_text';
      result.spec.push({ key, value });
    }
    {
      const value = $('#ow-mod_caliber_product_page').find('.ow-mod_37__picto--power-reserve').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const key = 'power_reserve';
      result.spec.push({ key, value });
    }
    {
      const value = $('#ow-mod_caliber_product_page').find('.ow-mod_37__picto--self-winding').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const key = 'caliber_movement';
      result.spec.push({ key, value });
    }
    $('.ow-product-list>li').each((idx, el) => {
      if (idx < 20) {
        const i = $(el).find('img').attr('alt');
        const ir = i.split('-');
        const v = ir[ir.length - 1].trim();
        result.variations.push(v);
      }
    });
  } catch (error) {
    console.log('Failed extraction for Omega with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.omegawatches.com/en-us/watches",
  });
  console.log(r);
  // r.collections.forEach(c => {
  //   console.log('collection...', c);
  //   const key = c.collection + '  ' + c.subCollection;
  //   r.items[key].forEach(w => console.log(w));
  // })
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i].subCollection;
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       ...r.items[c][j], entry: r.items[c][j].url, client: axios,
  //     })
  //     ex.spec.forEach(v => console.log(v.key + ' | ' + v.value));
  //   }
  // }

  // const rr = [
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Omega',
  //     brandID: 20,
  //     collection: 'Specialities',
  //     url: 'https://www.omegawatches.com/en-us/watch-omega-specialities-city-editions-51113402006001',
  //     name: 'City EditionsParis',
  //     reference: '511.13.40.20.06.001',
  //     retail: '',
  //     thumbnail: 'https://www.omegawatches.com/media/catalog/product/cache/5edafca295d0eaa013854cf48b1568f0dfdb28db2be0e9f9b92a86ae47388cb0/o/m/omega-specialities-51113402006001-list.jpg'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Omega',
  //     brandID: 20,
  //     collection: 'Specialities',
  //     url: 'https://www.omegawatches.com/en-us/watch-omega-specialities-city-editions-51113402003001',
  //     name: 'City EditionsLondon',
  //     reference: '511.13.40.20.03.001',
  //     retail: '',
  //     thumbnail: 'https://www.omegawatches.com/media/catalog/product/cache/5edafca295d0eaa013854cf48b1568f0dfdb28db2be0e9f9b92a86ae47388cb0/o/m/omega-specialities-51113402003001-list.jpg'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Omega',
  //     brandID: 20,
  //     collection: 'Specialities',
  //     url: 'https://www.omegawatches.com/en-us/watch-omega-specialities-city-editions-51113402002002',
  //     name: 'City EditionsNew York',
  //     reference: '511.13.40.20.02.002',
  //     retail: '$7,600.00',
  //     thumbnail: 'https://www.omegawatches.com/media/catalog/product/cache/5edafca295d0eaa013854cf48b1568f0dfdb28db2be0e9f9b92a86ae47388cb0/o/m/omega-specialities-51113402002002-list.jpg'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Omega',
  //     brandID: 20,
  //     collection: 'Specialities',
  //     url: 'https://www.omegawatches.com/en-us/watch-omega-specialities-city-editions-51113402006003',
  //     name: 'City EditionsUAE',
  //     reference: '511.13.40.20.06.003',
  //     retail: '',
  //     thumbnail: 'https://www.omegawatches.com/media/catalog/product/cache/5edafca295d0eaa013854cf48b1568f0dfdb28db2be0e9f9b92a86ae47388cb0/o/m/omega-specialities-51113402006003-list.jpg'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Omega',
  //     brandID: 20,
  //     collection: 'CONSTELLATION',
  //     url: 'https://www.omegawatches.com/en-us/watch-omega-constellation-quartz-24-mm-12320246008001',
  //     name: 'CONSTELLATION QUARTZ 24 MM',
  //     reference: '123.20.24.60.08.001',
  //     retail: '$4,050.00',
  //     thumbnail: '.....'
  //   },
  // https://www.omegawatches.com/en-us/watch-omega-constellation-quartz-24-mm-12320246008001
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     ...rr[i], entry: rr[i].url, client: axios,
  //   });
  //   console.log(ex)
  //   // ex.spec.forEach(v => console.log(v.key + ' | ' + v.value));
  //   console.log()
  // }
  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i].collection + '  ' + r.collections[i].subCollection;
    for (let j = 0; j < r.items[c].length; j++) {
      console.log(r.items[c][j].name)
      const ex = await extraction({
        client: axios,
        entry: r.items[c][j].url,
        ...r.items[c][j],
      })
      console.log(ex)
    }
  }
})();