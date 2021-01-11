const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { client, entry, source, brand, brandID, lang, base } = context;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];

    // get category ids for api calls
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $('.cl_teaser.js_cl_teaser').each((idx, el) => {
      const href = $(el).attr('href');
      if (href.match(/watches/i)) {
        cats.push($(el).attr('data-nid'));
      }
    })

    const catsub = [];
    for (const cat of cats) {
      const link = "https://www.hublot.com/en-us/api/watches?country_edition=US&collection=" + cat;
      console.log(link)
      const { data } = await client.get(link);
      if (data.length > 0) {
        data.forEach(v => {
          const reference = v.sku;
          const name = v.title;
          const collection = v.collection;
          const subCollection = v.subcollection;
          const thumbnail = base + v.image;
          const price = v.prices && v.prices.USD ? v.prices.USD : null;
          const url = base + v.url;
          if (catsub.indexOf(collection + subCollection) < 0) {
            catsub.push(collection + subCollection)
            result.collections.push({ collection, subCollection });
            result.items[collection + ' ' + subCollection] = [];
          }
          result.items[collection + ' ' + subCollection].push({
            source, lang, brand, brandID, url, collection, subCollection,
            name, reference, price, thumbnail,
          });
        })
      }
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Hublot with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  try {
    const { client, url: entry, source, lang, brand, brandID, collection, subCollection, name, reference, price, thumbnail, } = context;
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      collection,
      subCollection,
      name,
      reference,
      price,
      thumbnail,
      spec: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    $('.gn_accordion_section.pd_full_specs__category').each((idx, el) => {
      const cat = $(el).find('.pd_full_specs__category_title').text().trim();
      const keys = [];
      const values = [];
      $(el).find('.pd_full_specs__spec_title').each((idx, el) => {
        keys[idx] = $(el).text().trim();
      })
      $(el).find('.pd_full_specs__spec').each((idx, el) => {
        values[idx] = $(el).text().trim();
      })
      for (let i = 0; i < values.length; i++) {
        result.spec.push({ cat, key: keys[i], value: values[i] })
      }
    })
    return result;
  } catch (error) {
    const { entry, lang, source, } = context;
    console.error('Failed extraction for Hublot with error : ' + error);
    console.error('url:', entry);
    return { source, url: entry, lang, code: error.response.status, }
  }
};

(async () => {
  // const entry = "https://www.hublot.com/en-us/watches";
  // const base = "https://www.hublot.com";
  // const { data } = await axios.get(entry);
  // const $ = cheerio.load(data);
  // const cats = [];
  // $('.cl_teaser.js_cl_teaser').each((idx, el) => {
  //   const href = $(el).attr('href');
  //   if (href.match(/watches/i)) {
  //     cats.push($(el).attr('data-nid'));
  //   }
  // })
  // cats.push('1601');

  // const source = "official";
  // const lang = "en";
  // const brand = "Hublot";
  // const brandID = 46;
  // const result = { source, lang, brand, brandID, collections: [], items: {} };
  // for (const cat of cats) {
  //   const link = "https://www.hublot.com/en-us/api/watches?country_edition=US&collection=" + cat;
  //   console.log(link)
  //   const { data } = await axios.get(link);
  //   if (data.length > 0) {
  //     data.forEach(v => {
  //       const reference = v.sku;
  //       const name = v.title;
  //       const collection = v.collection;
  //       const subcollection = v.subcollection;
  //       const thumbnail = base + v.image;
  //       const price = v.prices && v.prices.USD ? v.prices.USD : null;
  //       const url = base + v.url;
  //       if (result.collections.indexOf(collection) < 0) {
  //         result.collections.push(collection);
  //         result.items[collection] = [];
  //       }
  //       result.items[collection].push({
  //         source, lang, brand, brandID, url, collection, subcollection,
  //         name, reference, price, thumbnail,
  //       });
  //     })
  //   } else {
  //     console.log('NO DATA');
  //   }
  // }

  // result.collections.forEach(c => {
  //   console.log(c)
  //   result.items[c].forEach(i => console.log('      ', i));
  // })

  const r = await indexing({
    client: axios,
    entry: "https://www.hublot.com/en-us/watches",
    source: "official",
    brand: "Hublot",
    brandID: 46,
    lang: "en",
    base: "https://www.hublot.com/",
  });
  console.log(r);

  // const u = [
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Hublot',
  //     brandID: 46,
  //     url: 'https://www.hublot.com/en-us/watches/mp/techframe-ferrari-tourbillon-chronograph-sapphire-white-gold-45-mm',
  //     collection: 'MP',
  //     subCollection: 'Techframe 45 mm',
  //     name: 'Techframe Ferrari Tourbillon Chronograph Sapphire White Gold 45MM',
  //     reference: '408.JW.0123.RX',
  //     price: 179000,
  //     thumbnail: 'https://www.hublot.com/sites/default/files/styles/watch_tile_472_592/public/techframe-ferrari-tourbillon-chronograph-sapphire-white-gold-45-mm-408.JW.0123.RX-soldier-shot.png?itok=F6_z_V6f'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Hublot',
  //     brandID: 46,
  //     url: 'https://www.hublot.com/en-us/watches/mp/techframe-ferrari-tourbillon-chronograph-carbon-yellow-45-mm',
  //     collection: 'MP',
  //     subCollection: 'Techframe 45 mm',
  //     name: 'Techframe Ferrari Tourbillon Chronograph Carbon Yellow 45MM',
  //     reference: '408.QU.0129.RX',
  //     price: 137000,
  //     thumbnail: 'https://www.hublot.com/sites/default/files/styles/watch_tile_472_592/public/techframe-ferrari-tourbillon-chronograph-carbon-yellow-45-mm-408.QU.0129.RX-soldier-shot.png?itok=XFIparzd'
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Hublot',
  //     brandID: 46,
  //     url: 'https://www.hublot.com/en-us/watches/mp/big-bang-mp-09-tourbillon-bi-axis-3d-carbon-45-mm',
  //     collection: 'MP',
  //     subCollection: 'MP-09',
  //     name: 'MP-09 Tourbillon Bi-Axis 3D Carbon 49MM',
  //     reference: '909.QD.1120.RX',
  //     price: 190000,
  //     thumbnail: 'https://www.hublot.com/sites/default/files/styles/watch_tile_472_592/public/big-bang-mp-09-tourbillon-bi-axis-3d-carbon-45-mm-909.QD.1120.RX-soldier-shot.png?itok=PaRaq2yc'
  //   }
  // ];

  // for (let i = 0; i < u.length; i++) {
  //   const ex = await extraction({ ...u[i], client: axios, });
  //   console.log(ex);
  // }
})();