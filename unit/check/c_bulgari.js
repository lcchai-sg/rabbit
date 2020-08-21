const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.links-nav-box .nav-title .lvl-3-wrap a').each((idx, el) => {
      if (idx > 42 && idx < 55 && idx !== 50) {
        const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const url = base + $(el).attr('href');
        cats.push({ name, url });
        if (result.collections.indexOf(name) === -1) {
          result.collections.push(name);
          result.items[name] = [];
        }
      }
    });
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url + '?sz=120')).data);
      $('.cell.small-6.medium-3.grid-row-item .cardContainer').each((idx, el) => {
        const url = base + $(el).find('.product-url ').attr('href');
        const thumbnail = $(el).find('.image-container .tile-image-container a picture source').attr('data-srcset');
        const reference = url.split('/').pop().replace('.html', '').trim();
        result.items[cat.name].push({
          url,
          collection: cat.name,
          name: cat.name + ' Watch ' + reference,
          reference,
          thumbnail
        });
      });
      return result;
    }
  }
  catch (error) {
    console.log('Failed for indexing class of Bulgari ' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = { url: entry, scripts: [], spec: [], related: [] };
    const $ = cheerio.load((await client.get(entry)).data);
    result.description = $('.product-short-description.show-for-medium p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const key = 'Spec';
    const value = $('.value.content.grid-container.text-center').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (value) {
      result.spec.push({ key, value });
    }
    $('.spec-article ').each((idx, el) => {
      const key = $(el).find('h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key) {
        result.spec.push({ key, value });
      }
    });
    result.retail = $('.prices .shoppable-price ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.collection = $('.product-name.show-for-medium').text().replace('Watch', '').trim();
    result.name = $('.product-name.show-for-medium').text().trim() + ' ' + result.reference;
    if (result.collection.toLowerCase().indexOf('serpenti' || 'lvcea' || 'divas dream' || 'high jewellery watches') > -1) {
      result.gender = 'F';
    }
    if (result.collection.toLowerCase().indexOf('octo' || 'gerald genta') > -1) {
      result.gender = 'M';
    }
    if (result.collection.toLowerCase().indexOf('bvlgari bvlgari' || 'grandes complications') > -1) {
      result.gender = 'X';
    }
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Bulgari ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.bulgari.com/en-int/watches/",
    base: "https://www.bulgari.com",
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