const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry: endpoint, base } = context;
    const result = { collections: [], items: {} };

    const res = await client.get(endpoint).then(response => {
      const ans = [response.data]
      let i;
      for (i = 0; i < 32; i++) {
        const thumbnailBase = 'https://www.tudorwatch.com/statics/images/watches/cover/';
        const refs = ans[0].watches.collection.model[i].rmc;
        const name = ans[0].watches.collection.model[i].watch_model;
        result.collections.push(name);
        result.items[name] = [];
        for (const reference of refs) {
          const url = base + ans[0].watches.collection.model[i].page_link + reference;
          const thumbnail = thumbnailBase + reference + '.png';
          result.items[name].push({
            source: 'official',
            url,
            thumbnail,
            collection: name,
            reference
          });
        }
        return result;
      };
    })
    return result;
  } catch (error) {
    console.log('Failed indexing for Tudor with error : ' + error);
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry } = context;
    const result = {
      url: entry,
      spec: [],
      scripts: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    console.log($('.tdr-global').text())
    const reference = $('.tdr-watch-details__header-watch-reference').text().trim().replace('Reference:', '');
    const name = $('.tdr-watch-details__header-watch-name').text().trim();
    const description = $('.tdr-variations__main-intro').text().trim();
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.gender = 'M';
    $('.tdr-watch-details__text li').each((idx, el) => {
      const key = $(el).find('.tdr-watch-details__title').text();
      const value = $(el).find('.tdr-watch-details__spectext').text();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Tudor with error : ' + error);
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.tudorwatch.com/services/watches/collection.en.global.json",
    base: "https://www.tudorwatch.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (1 === 1) {
    // if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.tissotwatches.com/en-en/shop/t1274071104100.html",
      base: "https://www.tissotwatches.com/",
    }
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
    // } else {
    //   console.log('indexing failed...')
    // }
  }
})();

