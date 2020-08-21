const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.view .view-content .item-list .views-field.views-field-nothing .field-content a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').replace('\'', '').trim();
      const url = $(el).attr('href');
      cats.push({ name, url });
      result.collections.push(name);
      result.items[name] = [];
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.content .item-list li a').each((idx, el) => {
        const url = $$(el).attr('href');
        const thumbnail = $$(el).find(' img').attr('src');
        const reference = "J" + $$(el).find('img').attr('alt').match(/\d+\.?\d*/);
        const name = $$(el).find('.field_title').text();
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          reference
        });
      });
      return result;
    }
    return result;
  }
  catch (error) {
    console.log('Failed for indexing class of Jaquet Droz' +
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
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.description = $('.description').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.name = $('.watch-infos h1').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.collection = $('.back-collection a h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.gender = 'M';
    result.thumbnail = $('.watch-picture img').attr('src');
    $('.watch-spec .table tr').each((idx, el) => {
      const key = $(el).find('th').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('td').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
      if (key === 'Reference') {
        result.reference = value.trim();
      }
    });
    $('.watch-infos .variantes div ul li a').each((idx, el) => {
      const ref = "J" + $(el).find('img').attr('alt').match(/\d+\.?\d*/);
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Jaquet Droz ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.jaquet-droz.com/en/watches",
    base: "https://www.jaquet-droz.com",
  };
  const r = await indexing(context);
  console.log(r)
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