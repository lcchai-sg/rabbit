const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, entry, lang, brand, brandID, base, name, reference, thumbnail, price, } = context;
    const result = {
      source: 'official',
      lang,
      brand,
      brandID,
      url: entry,
      name,
      reference,
      price,
      thumbnail,
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.thumbnail = $('.slider__body').find('img').first().attr('data-src');
    result.description = $('.accordion__body p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = $('.media__body h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-page-ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.country-reveal-container.product-page-price .price-from--prices').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.definitions__item').each((idx, el) => {
      const key = $(el).find('dt').text().trim();
      const value = $(el).find('dd').text().trim();
      result.spec.push({ key, value });
    });

    $('.container li .collapsible .accordion__body h3').each((idx, el) => {
      if (idx === 1) {
        const caliber = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace(/movement/i, '').trim();
        if (caliber) {
          const key = 'Caliber';
          const value = caliber;
          result.spec.push({ key, value });
        }
      }
    });
    $('.product__reference').each((idx, el) => {
      const ref = $(el).text().trim();
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    const { source, lang, entry, } = context;
    console.error('Failed extraction for Piaget with error : ' + error);
    console.error(entry);
    return { source, lang, url: entry, code: error.response.status, };
  }
};

(async () => {
  // const sitemap = new sitemapper({
  //   url: "https://www.piaget.com/sitemap.xml",
  //   timeout: 300000,
  // });
  // const sm = await sitemap.fetch();
  // sm.sites.forEach(u => console.log(u));

  let r = await extraction({
    client: axios,
    entry: "https://www.piaget.com/watches/altiplano/white-gold-ultra-thin-mechanical-watch-g0a29112",
    lang: "en",
    brand: "Piaget",
    brandID: 56,
    base: "https://www.piaget.com",
  });

  console.log(r)
})();