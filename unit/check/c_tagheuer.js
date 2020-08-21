const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.c-WtchsCarousel .o-OuterContainer ul li').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const name = $(el).find('a .p2').text().trim().split("TAG Heuer")[1];
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    console.log('cats>', cats)
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      const max = $$('.element-last.text-gw').text().trim();
      const collection = cat.url.split('/collections/')[1].replace('tag-heuer-', '').replace('/', '').trim();
      const apiUrl = 'https://www.tagheuer.com/on/demandware.store/Sites-TAG_INT-Site/en_SG/Search-UpdateGrid?cgid='
      const link = apiUrl + collection + '&start=0&sz=' + max;
      const $$$ = cheerio.load((await client.get(link)).data);
      $$$('.product').each((idx, el) => {
        const collection = $$(el).find('.pdp-link').text().trim();
        const reference = $$(el).attr('data-pid');
        const name = collection + " " + reference;
        const url = base + $$(el).find('.tile-body .link').attr('href');
        const thumbnail = base + $$(el).find('.image-container picture img').attr('src');
        const retail = $$(el).find('.sales').text().trim();
        result.items[cat.name].push({
          url,
          thumbnail,
          collection: cat.name,
          name,
          reference,
          retail
        });
      });
      return result;
    }
    return result;
  }
  catch (error) {
    console.log('Failed indexing Tag Heuer with error : ' + error);
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
    const retail = $('.sales').text().trim();
    result.retail = retail;
    result.name = $('.product-name').text().trim();
    result.description = $('#collapseDescription').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().replace("...", "");
    const collection = $('.product-name').text().trim();
    let reference = '';
    $('#tech-accordion .card').each((idx, tab) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      const cat = $(tab).find('.card-header h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      $(tab).find('.col-12.col-lg-6 .spec-title').each((idx, el) => {
        key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        keys.push(key);
      });
      $(tab).find('.spec-value').each((idx, el) => {
        value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        values.push(value);
      });
      keys.map((key, i) => {
        if (cat === 'Reference number' || cat === 'Referenznummer') {
          result.reference = value;
        } else {
          const value = values[i];
          result.spec.push({ cat, key, value });
        }
      });
    });
    result.name = collection + " " + reference;
    result.collection = collection;
    result.gender = 'M';
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Tag Heuer' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.tagheuer.com/en",
    base: "https://www.tagheuer.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.tagheuer.com/sg/en/timepieces/collections/tag-heuer-carrera/44-mm-calibre-heuer-02/CBN2A1A.BA0643.html",
      base: "https://www.tagheuer.com",
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

