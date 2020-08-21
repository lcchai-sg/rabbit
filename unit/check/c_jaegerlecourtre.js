const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base, } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.hmp-col__list li').each((idx, el) => {
      const href = $(el).find('a').attr('href');
      const name = $(el).find('a  .hmp-col__text.hmp-col__text--large').text().trim();
      const url = base + href;
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$(' .plp-crd.plp-crd--collection > a').each((idx, el) => {
        const href = $$(el).attr('href');
        const thumbnailImg = $$(el).find('[itemprop="image"]').attr('content');
        const name = $$(el).find('.plp-crd__nam').text().trim();
        const material = $$(el).find('.plp-crd__mat').text().trim();
        const price = $$(el).find('.plp-crd__prc-str').text();

        result.items[cat.name].push({
          url: base + href,
          thumbnail: base + thumbnailImg,
          collection: cat.name,
          name,
          material,
          price,
        })
      })
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Jaeger Le Courte' +
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
      spec: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('.pdp-top__sku').text().trim();
    const name = $('.pdp-top__name').text().trim();
    const material = $('.pdp-top__material').text().trim();
    const description = $('#sect1 .Accordion-paragraph ').text().trim();
    const retail = $('.pdp-top__price  span.pdp-top__amount').text().trim();
    result.reference = reference;
    result.description = description;
    result.material = material;
    result.name = name;
    result.retail = retail;
    result.collection = entry.split('/watches/')[1].split('/')[0];
    result.thumbnail = base + $('#pdp-slider__list img').attr('src');
    if (result.collection.toLowerCase() === 'reverso' || 'rendez-vous') {
      result.gender = 'F';
    } else {
      result.gender = 'M';
    }
    $('dd#sect2 div ').each((idx, el) => {
      const key = $(el).find(' b').text();
      const value = $(el).html().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split("</b>")[1];
      if (key !== '') {
        result.spec.push({ key, value });
      }
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Jaeger Le Courte' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.jaeger-lecoultre.com/us/en/home-page.html",
    base: "https://www.jaeger-lecoultre.com",
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