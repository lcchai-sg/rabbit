const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const urls = [{
      key: 'collections',
      url: entry + 'collections'
    },
    {
      key: 'hc',
      url: entry + 'high-complications'
    }]
    const cats = [];
    for (const url of urls) {
      const $ = cheerio.load((await client.get(url.url)).data);
      if (url.key === 'hc') {
        $('.item.item-family .heading-item a').each((idx, el) => {
          const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' HC';
          const url = base + $(el).attr('href');
          cats.push({ name, url });
          result.collections.push(name);
          result.items[name] = [];
        });
      } else {
        $('.item.item-family .heading-item a').each((idx, el) => {
          const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          const url = base + $(el).attr('href');
          cats.push({ name, url });
          result.collections.push(name);
          result.items[name] = [];
        });
      }
    }
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.col-6.col-md-3.watch-slot .item.item-collection').each((idx, el) => {
        const thumbnail = $$(el).find('.item-image a img').attr('src');
        const words = thumbnail.split('/');
        let url = '';
        let reference = '';
        for (const word of words) {
          if (word.match(/png/i)) {
            reference = word.replace('.png', '').trim().toUpperCase();
          }
        }
        const name = $$(el).find('.item-image a img').attr('alt') + ' ' + reference;
        result.items[cat.name].push({
          source: 'official',
          url,
          thumbnail,
          collection: cat.name,
          reference,
          name,
        });
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Parmigiani' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.collection = $('.col-md-3 h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(' ')[0].trim();
    result.reference = entry.split('/').pop().toUpperCase();
    result.name = $('.text-primary.watch-detail-h1-span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + result.reference;
    result.retail = $('.detail-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Info', '').trim();
    result.description = $('.col-12.col-md-8.lead.mb-3.mb-md-5.text-justify ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = 'M';
    let key = '';
    let value = '';
    const keys = [];
    const values = [];
    let materialCount = 1;
    let colorCount = 1;
    $('.col-md-4 .row dt').each((idx, el) => {
      key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key === 'Material') {
        key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + materialCount;
        materialCount++;
      }
      if (key === 'Colour' || key === 'Farbe') {
        key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + colorCount;
        colorCount++;
      }
      keys.push(key);
    });
    $('.col-md-4 .row dd').each((idx, el) => {
      value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      values.push(value);
    });
    keys.map((key, i) => {
      const value = values[i];
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Parmigiani' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.parmigiani.com/en/",
    base: "https://www.parmigiani.com",
  };
  const r = await indexing(context);
  console.log(r.items[r.collections[0]])
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
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
