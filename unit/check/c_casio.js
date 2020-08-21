const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const categories = [];
    const $ = cheerio.load((await client.get(entry)).data);

    $('.detail-list').each((idx, element) => {
      $(element).find('.grid-1').each((i, elem) => {
        $(elem).find('a').each((x, el) => {
          const catLink = $(el).attr('href');
          categories.push((base.concat(catLink)));
        })
      })
    });

    let href;
    let collection;
    let thumbnail;
    let name;
    let url;
    let retail;

    categories.shift();
    for (var watchLink of categories) {
      const watchDetail = cheerio.load((await client.get(watchLink)).data);
      watchDetail('.contents-body').find('.model-list').each((idx, element) => {
        $(element).find('.column').each((x, elem) => {
          $(elem).find('.info').each((ind, el) => {
            href = base.concat($(el).find('a').attr('href'));
            collection = $(el).find('a').attr('href').split('/')[3];
            url = base.concat($(el).find('a').attr('href'));
            name = $(el).find('a h5').text();
            retail = '$ ' + $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(' ')[5];
            thumbnail = $(el).find('.product-figure .figure img').attr('src');
          })
        })
        thumbnail = 'https:'.concat(thumbnail);

        //creating the result object with collections and items
        if (result.collections.indexOf(collection) === -1) {
          result.collections.push(collection);
          result.items[collection] = [];
        }

        //populating the result items
        result.items[collection].push({
          source: 'official',
          url: url,
          name: name,
          thumbnail: thumbnail,
          collection: collection,
          reference: name,
          retail: retail,
        })
      })
      return result;
    }
  } catch (error) {
    console.log('Failed for indexing class of Casio ' +
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
    const name = $('div.head > div.name > h2').text().trim();
    const description = $('.feature-conts-all .js-cont-wrap > p').text().trim();
    result.retail = $('.price ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = name;
    result.reference = name;
    result.description = description;
    result.collection = entry.split('/watches/')[1].split('/')[0];
    result.thumbnail = 'https:' + $('.swiper-slide').attr('data-img-normal');
    if (result.collection === 'g-shock-s-series') {
      result.gender = 'F';
    } else {
      result.gender = 'M';
    }

    $(" .narrow-contents > div > article > div.js-more-list > ul.display-list li").each((idx, elem) => {
      const detail = $(elem).text();
      result.spec.push(detail);
    })
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Casio ' +
      ' with error : ' + error
    )
    return [];
  }
}

(async () => {
  const context = {
    entry: "https://www.casio.com/products/watches",
    base: "https://www.casio.com",
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