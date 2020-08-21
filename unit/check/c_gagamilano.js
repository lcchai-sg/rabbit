const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.grid-col-4.wow.fadeInDown a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const url = $(el).attr('href');
      cats.push({ name, url });
      result.collections.push(name);
      result.items[name] = [];
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url)).data);
      $('.col-5.grid a').each((idx, el) => {
        const url = $(el).attr('href');
        const name = $(el).find('.info-product').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('.image-product img').attr('src');
        const reference = $(el).find('.ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.items[cat.name].push({
          source: 'official',
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
    console.log('Failed for indexing class of Gagamilano ' +
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
    result.name = $('.breadcrumb h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + $('.col-md-12.border_b h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + ' ' + $('.single-product--ref .uppercase').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.collection = $('.breadcrumb h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.single-product--ref .uppercase').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.regular-price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.container .row .col-md-12.border_b .padd_txt p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = $('.swiper-slide img').attr('src');
    $('.list ').each((idx, el) => {
      const key = $(el).find('h4').text();
      const value = $(el).find('p').text();
      result.spec.push({ key, value });
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Gagamilano ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.gagamilano.com/collections/",
    base: "https://www.gagamilano.com",
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
