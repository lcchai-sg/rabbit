const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const urls = [
      {
        gender: 'M',
        url: 'https://www.prestigetime.com/luxury-watches-for-men.html&page='
      },
      {
        gender: 'F',
        url: 'https://www.prestigetime.com/luxury-watches-for-women.html&page='
      }
    ];
    const results = [];
    for (const u of urls) {
      let page = 1;
      const link = u.url + page;
      const data = (await client.get(link)).data;
      const $ = cheerio.load(data);
      $('.col-xs-12.col-sm-4.col-lg-3').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        const name = $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const brand = $(el).find('a strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('a img').attr('src');
        const retail = $(el).find('.caption-bottom').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(' ')[3].trim();
        const price = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const reference = $(el).find('a img').attr('alt').replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        results.push({
          url,
          name,
          price,
          retail,
          thumbnail,
          brand,
          reference,
          gender: u.gender,
        })
      });
      return results;
    }
    return results;
  } catch (error) {
    console.error('Failed for indexing class of Prestigetime with error : ' + error)
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('.container ul .active').text().replace('Watch Details', '').trim() ? $('.container ul .active').text().replace('Watch Details', '').trim() : '';
    result.name = $('.item-series').text().trim() ? $('.item-series').text().trim() : '';
    result.brand = $('.brand-item a').text().trim() ? $('.brand-item a').text().trim() : '';
    result.thumbnail = $('.lb-image-link img').attr('src');

    let breadcrumb = $('.breadcrumb').text()
    let words = []
    breadcrumb.split('\n').map((text) => {
      words.push(text.trim())
    });
    if (words.length > 0) {
      if (words[4]) {
        result.collection = words[2];
        result.subcollection = words[3];
      }
      else {
        result.collection = words[2];
      }
    }

    $('.table.table-condensed.item-table tr').each((idx, el) => {
      let key = '';
      let value = '';
      const word = $(el).find('td').text().replace(/([a-z](?=[A-Z]))/g, '$1 ').trim();
      if (word.indexOf('Condition') > -1) {
        key = 'Condition';
        value = word.split('Condition')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Case Shape') > -1) {
        key = 'Case Shape';
        value = word.split('Case Shape')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Case Dimensions') > -1) {
        key = 'Case Dimensions';
        value = word.split('Case Dimensions')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Case Material') > -1) {
        key = 'Case Material';
        value = word.split('Case Material')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Dial Color') > -1) {
        key = 'Dial Color';
        value = word.split('Dial Color')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Crystal') > -1) {
        key = 'Crystal';
        value = word.split('Crystal')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Bezel') > -1) {
        key = 'Bezel';
        value = word.split('Bezel')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Screw-in Crown') > -1) {
        key = 'Screw-in Crown';
        value = word.split('Screw-in Crown')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Water Resistance') > -1) {
        key = 'Water Resistance';
        const values = word.split('Water Resistance').pop().trim().split('.');
        for (const value of values) {
          if (value.length > 3 && value.length < 12) {
            result.spec.push({ key, value })
          }
        }
      }
      if (word.indexOf('Case Back') > -1) {
        key = 'Case Back';
        value = word.split('Case Back')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Band Material') > -1) {
        key = 'Band Material';
        value = word.split('Band Material')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Color/Finish') > -1) {
        key = 'Color/Finish';
        value = word.split('Color/Finish')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Clasp') > -1) {
        key = 'Clasp';
        value = word.split('Clasp')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Lug Width') > -1) {
        key = 'Lug Width';
        value = word.split('Lug Width')[1].trim();
        result.spec.push({ key, value })
      }
      if (word.indexOf('Movement') > -1) {
        key = 'Movement';
        value = word.split('Movement')[1].split(/\r?\n/)[0].trim();
        result.spec.push({ key, value })
      }
    });
    $('.col-xs-12.col-md-7.item-description-tab li').each((idx, el) => {
      const key = 'Features';
      const value = $(el).text();
      result.spec.push({ key, value })
    });
    return result;
  } catch (error) {
    console.error('Failed for extraction class of Prestigetime' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.prestigetime.com/",
    base: "https://www.prestigetime.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r.length > 0) {
    const context = r[0];
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
