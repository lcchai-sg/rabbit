const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const result = { collections: [], items: {} };
  const cats = [];
  try {
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
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Jaeger LeCoultre with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('.pdp-top__sku').text().trim();
    result.name = $('.pdp-top__name').text().trim();
    result.material = $('.pdp-top__material').text().trim();
    result.description = $('#sect1 .Accordion-paragraph ').text().trim();
    result.retail = $('.pdp-top__price  span.pdp-top__amount').text().trim();
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
      if (key !== '') result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Jaeger LeCoultre with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.jaeger-lecoultre.com/us/en/home-page.html",
    brandID: 16,
    brand: "Jaeger LeCoultre",
    base: "https://www.jaeger-lecoultre.com",
  });
  // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = r.items[r.collections[0]];
  // const rr = [
  //   "",
  //   "",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client: axios,
  //     brand: "Jaeger LeCoultre",
  //     brandID: 16,
  //     base: "https://www.jaeger-lecoultre.com",
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        ...r.items[c][j],
        client: axios,
        entry: r.items[c][j].url,
      });
      console.log(ex.url);
      console.log()
      ex.spec.forEach(v => console.log(v.key + ' | ' + v.value));
      console.log()
    }
  }
})();