const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.slick-track .views-row .views-field.views-field-name a').each((idx, el) => {
      const name = $(el).text();
      const url = $(el).attr('href');
      if (result.collections.indexOf(name) < 0) {
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.item-list li').each((idx, el) => {
        const url = base + $(el).find('a').attr('href');
        const name = $(el).find('.field.field-name-field-collections-type.field-type-taxonomy-term-reference').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('.field-item img').attr('src');
        const reference = $(el).find('.field.field-name-title-field.field-type-text').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
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
    console.log('Failed for indexing class of Girard Perregaux ' +
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
    const word = $('.watch-intro-title h1').text().split(/\r?\n/);
    if (word) {
      result.collection = word[1].trim();
      result.name = word[2].trim();
      result.reference = word[3].replace('REF :', '').trim();
    }
    result.name = $('.watch-intro-title h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('#watch-price-value ').text().trim();
    result.description = $('.watch-intro-title .field-items .field-item').text().trim();
    result.thumbnail = $('#watch-presentation img').attr('src');
    $('.watch-feature-watch .field').each((idx, el) => {
      const key = $(el).find('.field-label').text().trim();
      const value = $(el).find('.field-item').text().trim();
      result.spec.push({ key, value })
    });
    $('.watch-feature-movement .field').each((idx, el) => {
      const key = $(el).find('.field-label').text().trim();
      const value = $(el).find('.field-item').text().trim();
      result.spec.push({ key, value })
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Girard Perregaux ' +
      ' with error : ' + error
    )
    return [];
  }
}

(async () => {
  const context = {
    entry: "https://www.girard-perregaux.com/en",
    base: "https://www.girard-perregaux.com",
  };
  const r = await indexing(context);
  console.log('indexing result>', r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.girard-perregaux.com/en/bridges/classic-bridges-45-mm-86000-52-001-bb6a",
      base: "https://www.girard-perregaux.com",
    }
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