const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  // const base = "https://www.midowatches.com";
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.page-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.reference-number').first().text();
    result.price = $('.reference-price .h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //result.description = $('.col-12.col-md-10.col-lg-8.offset-md-1.offset-lg-2.my-lg-2.text-justify p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.col-12.col-md-10.col-lg-8.offset-md-1.offset-lg-2.my-lg-2.text-justify.mb-2.px-2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = base + ($('.field--name-field-reference-top-image img').attr('src') ? $('.field--name-field-reference-top-image img').attr('src') : $('.col-12.col-md-6 .slider.watches-slider img').attr('src'));
    $('.reference-price .h4').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
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
    });
    $('.image-caption').each((idx, el) => {
      const ref = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split(' ').pop();
      result.related.push(ref);
    });
  } catch (error) {
    console.error('Failed extraction for Mido with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = [
    "https://www.midowatches.com/us/swiss-watches-collections/classic-watch-baroncelli/baroncelli-heritage-gent-m0274071601000",
    "https://www.midowatches.com/us/swiss-watches-collections/classic-watch-baroncelli/baroncelli-chronometer-silicon-gent-m0274084101100",
  ];

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
      base: "https://www.midowatches.com",
    });
    console.log(ex);
  }
})();