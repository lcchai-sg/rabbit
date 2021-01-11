const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  const cats = [];
  try {
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
        const url = base + href.substr(1);
        const reference = $$(el).find('.article_footer .article_ref').text().trim();
        const material = $$(el).find('.article_footer .code_or').text().trim();
        const collection = $$(el).find('.article_footer .collection_name').text().trim();
        const thumbnail = $$(el).find('picture img').attr('data-src');
        result.items[cat.name].push({
          url, collection, reference, material, thumbnail,
        });
      });
    }
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Patek Philippe with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('section.introduction h1 .reference').text();
    result.collection = $('section.introduction h1 .complication').text();
    result.movementType = $('section.introduction h1 .caliber_type_header').text();
    result.name = $('.introduction_header h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('section.introduction .article_description .articleDescription').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().trim();
    result.retail = $('#product_price').text().trim();
    result.gender = 'X';
    $('section.introduction .article_description .article_flexbox_right_content').each((idx, el) => {
      result.spec.push({
        key: $(el).find('.article_flexbox_right_content_title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim(),
        value: $(el).find('.article_flexbox_right_content_text').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim()
      })
    });
  } catch (error) {
    console.log('Failed extraction for Patek Philippe with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.patek.com/en/home",
    brandID: 22,
    brand: "Patek Philippe",
    base: "https://www.patek.com/",
  });
  // console.log(r);
  r.collections.forEach(c => {
    r.items[c].forEach(w => {
      console.log(w.reference, w.url);
    })
  })

  // const rr = [
  //   "https://www.patek.com/en/collection/grand-complications/7140R-001",
  //   "https://www.patek.com/en/collection/nautilus/7118-1R-010",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Patek Philippe",
  //     brandID: 22,
  //   })
  //   console.log(ex);
  // }
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       entry: r.items[c][j].url,
  //       client: axios,
  //       ...r.items[c][j],
  //     });
  //     ex.spec.forEach(s => console.log(s.key + " | " + s.value));
  //   }
  // }
})();