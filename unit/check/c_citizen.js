const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.wrap-sub-menu  ul:nth-child(1) li .nav-lvl-2-block li').each((idx, el) => {
      const href = $(el).find('a').attr('href');
      const name = $(el).find('a').text().trim();
      const url = href;
      if (result.collections.indexOf(name) === -1) {
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url });
      }
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.watch').each((idx, el) => {
        const href = $$(el).find('a').attr('href');
        const reference = $$(el).find('.product-info div:nth-child(2)').text().trim();
        const name = $$(el).find('span.name').text().trim();
        const retail = $$(el).find('.product-sales-price').text().trim();
        const thumbnails = $$(el).find('.img  div picture img').attr('src');
        const collection = cat.name;
        const thumbnail = "http:" + thumbnails;
        result.items[cat.name].push({
          url: base + href,
          collection: collection,
          reference,
          name,
          retail,
          thumbnail,
        });
      });
      return result;
    }
  }
  catch (error) {
    console.log('Failed for indexing class of Citizen ' +
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
      spec: [],
      scripts: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    let reference = entry.split("/").pop().replace(".html", "").trim();
    if (reference.indexOf('?') > -1) {
      reference = reference.split('?')[0];
    }
    const name = $('.product-name.h1-style').text().trim();
    const description = $('.product-col-2.product-detail.wrap-info  .description').text().trim();
    let gender;
    if (result.url.match(/mens/)) {
      gender = "M"
    } else {
      gender = "F"
    }
    result.url = result.url.match(/.*html/g)[0];
    result.gender = gender;
    result.reference = reference;
    result.name = name;
    result.description = description;
    result.thumbnail = 'https:' + $('.product-primary-image img').attr('src');
    $('.bloc-text').each((idx, el) => {
      const key = $(el).find('.small-title').text();
      const value = $(el).find(' .description').text().trim();
      result.spec.push({ key, value });
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Citizen ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.citizenwatch.com/us/en/home/",
    base: "https://www.citizenwatch.com",
  };
  const r = await indexing(context);
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
