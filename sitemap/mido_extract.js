const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  try {
    const { client, entry, lang, brand, brandID } = context;
    const base = "https://www.midowatches.com";
    const result = {
      source: 'official',
      url: entry,
      brand,
      brandID,
      lang,
      scripts: [],
      spec: [],
      related: [],
      caliber: {},
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.page-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = result.name.split(' ').pop();
    result.retail = $('.reference-price .h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.col-12.col-md-10.col-lg-8.offset-md-1.offset-lg-2.my-lg-2.text-justify.mb-2.px-2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //result.description = $('.col-12.col-md-10.col-lg-8.offset-md-1.offset-lg-2.my-lg-2.text-justify p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = base + ($('.field--name-field-reference-top-image img').attr('src') ? $('.field--name-field-reference-top-image img').attr('src') : $('.col-12.col-md-6 .slider.watches-slider img').attr('src'));
    result.caliber.reference = $('.taxonomy-term.vocabulary-caliber-movement .field.field--name-name.field--type-string ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.reference-price .h4').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
    $('.col-12.col-md-6.col-lg-3.technical-details-items ul li').each((idx, el) => {
      const key = $(el).find('.field--label').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('.field--item').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key || value) {
        result.spec.push({ key, value });
      }
    });
    $('.image-caption').each((idx, el) => {
      const ref = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split(' ').pop();
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Mido with error : ' + error)
    return [];
  }
};

const extract = async (contex) => {
  try {
    const { client, entry, lang, brand, brandID } = context;
    const base = "https://www.midowatches.com";
    const result = {
      source: 'official',
      url: entry,
      brand,
      brandID,
      lang,
      scripts: [],
      spec: [],
      related: [],
      caliber: {},
    };
    const $ = cheerio.load((await client.get(entry)).data);
    $('.col-12.col-md-6.col-lg-3.technical-details-items').each((idx, el) => {
      const clazz = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      $(el).find('li').each((idx1, el1) => {
        const d = $(el1).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        let key = '';
        let value = '';
        if (d.indexOf(':') > 0) {
          key = d.split('  ')[0];
          value = d.split('  ')[1];
        } else {
          value = d.split('  ')[0];
        }
        result.spec.push({ clazz, key, value });
      })
      // const key = $(el).find('.field--label').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      // const value = $(el).find('.field--item').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      // if (key || value) {
      //   result.spec.push({ clazz, key, value });
      // }
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Mido with error : ' + error)
    return [];
  }
}

const context = {
  client: axios,
  entry: "https://www.midowatches.com/us/swiss-watches-collections/classic-watch-baroncelli/baroncelli-diamonds-m0072283603600",
  lang: "en",
  brand: "mido",
  brandID: 172,
};

(async () => {
  let r = await extract(context);
  console.log(r);
  process.exit(0);
})();