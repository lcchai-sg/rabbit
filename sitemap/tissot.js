const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, entry, source, lang, brand, brandID, } = context;
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      spec: [],
      scripts: [],
      related: []
    };
    const $ = cheerio.load((await axios.get(entry)).data);
    const reference = $('.product-sku').text().trim();
    const name = $('.product-name').text().trim();
    const retail = $('.price-wrapper').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const description = $('.product-description p').text().trim();
    result.thumbnail = $('.product-mosaic__img-container img').attr('src');
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.retail = retail;
    result.gender = 'X';

    $('.product-specs .tabs-container li').each((idx, el) => {
      const key = $(el).find('h4').text();
      const value = $(el).find('p').text();
      result.spec.push({ key, value });
    });
    $('.swiper-wrapper').each((idx, el) => {
      const ref = $(el).find('.swiper-slide a ').attr('href');
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Tissot with error : ' + error)
    return {};
  }
};

(async () => {
  // const sitemap = new sitemapper({
  //   url: "https://www.tissotwatches.com/media/sitemap/sitemap_en_en.xml",
  //   timeout: 300000,
  // });
  // const sm = await sitemap.fetch();
  // sm.sites.sort();
  // sm.sites.forEach(v => {
  //   if (v.match(/\/en-en\/t\d{8,13}/i)) {
  //     console.log(v);
  //   }
  // })

  const u = [
    "https://www.tissotwatches.com/en-en/t81722392.html",
    "https://www.tissotwatches.com/en-en/t81722492.html",
    "https://www.tissotwatches.com/en-en/t8534051926700.html",
    "https://www.tissotwatches.com/en-en/t8654059903801.html",
    "https://www.tissotwatches.com/en-en/t82740933.html",
    "https://www.tissotwatches.com/en-en/t8614059903300.html",
    "https://www.tissotwatches.com/en-en/t8614059903301.html",
    "https://www.tissotwatches.com/en-en/t82455012.html",
    "https://www.tissotwatches.com/en-en/t82655012.html",
    "https://www.tissotwatches.com/en-en/t8634099905700.html",
  ];

  for (let i = 0; i < u.length; i++) {
    let r = await extraction({
      source: "official",
      lang: "en",
      brand: "Tissot",
      brandID: 82,
      entry: u[i],
    })
    console.log(r);
  }
})();