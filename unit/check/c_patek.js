const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('nav#main_navigation .collection_models .left_panel a').each((idx, el) => {
      const href = $(el).attr('href');
      const name = $(el).find('.family_name')
        .contents().filter((idx, e) => e.type === 'text')
        .text().trim();
      let countT = $(el).find('.family_name .number_of_models').text();
      const count = parseInt(countT.substr(0, countT.indexOf(' ')));
      const url = base + href.substr(1);
      if (name !== 'Watch Finder') {
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url, count });
      }
    });

    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('section.articles div.article').each((idx, el) => {
        const href = $$(el).find('a').attr('href');
        const reference = $$(el).find('.article_footer .article_ref').text().trim();
        const material = $$(el).find('.article_footer .code_or').text().trim();
        const collection = $$(el).find('.article_footer .collection_name').text().trim();
        const thumbnail = $$(el).find('picture img').attr('data-src');
        result.items[cat.name].push({
          url: base + href.substr(1),
          thumbnail,
          collection,
          reference,
          material,
        });
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Patek' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      source: 'official',
      url: entry,
      scripts: [],
      spec: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('section.introduction h1 .reference').text();
    const collection = $('section.introduction h1 .complication').text();
    const movementType = $('section.introduction h1 .caliber_type_header').text();
    result.name = $('.introduction_header h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = reference;
    result.collection = collection;
    result.movementType = movementType;
    result.description = $('section.introduction .article_description .articleDescription').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().trim();
    result.retail = $('#product_price').text().trim();
    result.gender = 'X';
    $('section.introduction .article_description .article_flexbox_right_content').each((idx, el) => {
      result.spec.push({
        key: $(el).find('.article_flexbox_right_content_title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim(),
        value: $(el).find('.article_flexbox_right_content_text').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim()
      })
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Patek' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.patek.com/en/home",
    base: "https://www.patek.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    // const context = {
    //   url: 
    //   base: 
    // }
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
