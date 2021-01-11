const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, entry, source, lang, brand, brandID, name, collection, gender, reference, thumbnail, price, } = context;
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      name,
      reference,
      collection,
      gender,
      thumbnail,
      price,
      scripts: [],
      spec: [],
      related: [],
    }
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);

    $('.productDescription__item').each((idx, el) => {
      const d = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split('  ');
      const key = d[0];
      for (let k = 1; k < d.length; k++) {
        result.spec.push({ key, value: d[k], });
      }
      // $(el).find('.productDescription__item-body').each((idx, el) => {
      //   const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      //   result.spec.push({ key, value });
      // })
    });
    return result;
  } catch (error) {
    const { entry, lang, source, } = context;
    logger.error('Failed extraction for Marc Jacobs with error : ' + error);
    logger.error('url:', entry);
    return { source, url: entry, lang, code: error.response.status, }
  }
};

(async () => {
  // const sitemap = new sitemapper({
  //   url: "https://www.marcjacobs.com/sitemap_0.xml",
  //   timeout: 300000,
  // });

  const source = "official";
  const lang = "en";
  const brand = "Marc Jacobs";
  const brandID = 214;
  // const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };

  // const d = await sitemap.fetch();
  // d.sites.forEach(v => {
  //   if (v.match(/-watch\//i)) {
  //     const nr = v.split('/');
  //     const name = nr[nr.length - 2];
  //     const reference = nr[nr.length - 1];
  //     result.items['all'].push({
  //       source, lang, brand, brandID, url: v, name, reference, price: null,
  //     })
  //   }
  // });

  // console.log(result.items['all']);
  // console.log(result.items['all'].length);

  const result1 = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  const e = "https://www.marcjacobs.com/the-marc-jacobs/the-accessories/watches/?start=0&sz=100";
  const b = "https://www.marcjacobs.com";
  const { data } = await axios.get(e);
  const $ = cheerio.load(data);
  $('.product-grid__list-element').each((idx, el) => {
    const url = b + $(el).find('a').attr('href');
    const name = $(el).find('a').attr('data-productname');
    const reference = $(el).find('a').attr('data-master');
    const thumbnail = $(el).find('img').attr('data-src');
    const price = $(el).find('.toolbar__price').attr('content');
    result1.items['all'].push({
      source, lang, brand, brandID, url, name, reference, thumbnail, price,
    });
  })

  // $('.lockup-card.lockup-card--plp').each((idx, el) => {
  //   const url = b + $(el).attr('href').split('?')[0];
  //   const name = $(el).attr('data-productname');
  //   const reference = $(el).attr('data-master');
  //   result1.items['all'].push({
  //     source, lang, brand, brandID, url, name, reference, price: null,
  //   })
  // })

  // console.log(result1.items['all']);
  // console.log(result1.items['all'].length);

  // const a1 = result.items['all'].map(r => r.url);
  // const a2 = result1.items['all'].map(r => r.url);

  // a1.forEach(v => {
  //   if (a2.indexOf(v) < 0) console.log('website not found >>>', v);
  // })
  // console.log()
  // console.log()
  // a2.forEach(v => {
  //   if (a1.indexOf(v) < 0) console.log('sitemap not found >>>', v);
  // })

  for (let j = 0; j < result1.items['all'].length; j++) {
    let ex = await extraction({
      client: axios,
      source: 'official',
      lang: 'en',
      entry: result1.items['all'][j].url,
      brand: result1.items['all'][j].brand,
      brandID: result1.items['all'][j].brandID,
      name: result1.items['all'][j].name,
      reference: result1.items['all'][j].reference,
      thumbnail: result1.items['all'][j].thumbnail,
      price: result1.items['all'][j].price,
    });

    ex.spec.forEach(v => {
      console.log(v.key, v.value)
    })
  }

  process.exit(0);
})();