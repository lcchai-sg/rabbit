const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
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
  } catch (error) {
    console.error('Failed extraction for Piaget with error : ' + error);
    console.error(entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  // const sitemap = new sitemapper({
  //   url: "https://www.piaget.com/sitemap.xml",
  //   timeout: 300000,
  // });
  // const sm = await sitemap.fetch();
  // sm.sites.forEach(u => console.log(u));

  const r = [
    "https://www.piaget.com/watches/limelight-gala/rose-gold-diamond-watch-g0a45161",
    "https://www.piaget.com/watches/limelight-gala/white-gold-diamond-watch-g0a43362",
    "https://www.piaget.com/watches/limelight-gala/white-gold-diamond-watch-g0a43161",
    "https://www.piaget.com/watches/limelight-gala/rose-gold-diamond-watch-g0a39194",
    "https://www.piaget.com/watches/limelight-gala/rose-gold-diamond-watch-g0a37196",
  ];


  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      entry: r[i],
      client: axios,
      base: "https://www.piaget.com",
    });
    console.log(ex);
  }
})();